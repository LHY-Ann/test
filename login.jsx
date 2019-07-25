import React, { Component } from "react"
import { Form, Icon, Input, Button, Checkbox, Select } from 'antd';
import "antd/dist/antd.css"
import intl from "react-intl-universal"
import axios from "axios"
class Login extends Component {
  state = {
    language: "zh-CN"
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let user = {
          username: values.username,
          password: values.password,
        }
        window.localStorage.setItem("user", JSON.stringify(user));
        this.props.history.push("/home")
      }
    });
  };
  render() {
    let {
      language
    } = this.state
    const { Option } = Select
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Select
          showSearch
          style={{ width: 200 }}
          value={language}
          optionFilterProp="children"
          onChange={this.onChange.bind(this)}
          className="select"
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value="zh-CN">中文</Option>
          <Option value="en-US">English</Option>
          <Option value="zh-TW">繁體中文</Option>
        </Select>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder={intl.get('login.usernamePlaceholder')}
              ref={(input) => { this.input = input }}

            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder={intl.get('login.passwordPlaceholder')}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('text', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="radius-setting" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="text"
              placeholder={intl.get('login.catpchaPlaceholder')}
            />,
          )}
        </Form.Item>
        <Form.Item>
          222
            </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}

          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
              </Button>
        </Form.Item>
      </Form>
    );
  }
  onChange(value) {
    this.setState({
      language: value
    })
    localStorage.setItem('language', value);
    window.location.reload()
  }
  componentDidMount() {
    this.input.focus()
    this.languageInit()
    axios.get("http:/captcha").then(res => {
      console.log(res.data)
    })
  }
  languageInit() {
    let currentLocale = localStorage.getItem('language') || 'zh-CN'
    intl.init({
      currentLocale: currentLocale,
      locales: {
        [currentLocale]: require(`../i18n/${currentLocale}`).default
      }
    }).then(() => {
    })
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'zh-CN')
      this.setState({
        language: 'zh-CN'
      })
    } else {
      this.setState({
        language: currentLocale
      })
    }
  }
}
//事件
// Object.assign(Login.prototype,{

// })
export default Form.create()(Login)

