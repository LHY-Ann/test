import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Select } from 'antd';
import intl from 'react-intl-universal'
import axios from 'axios'

const { Option } = Select;

class Login extends Component {
    state = {
        count: 60,
        liked: true,
        captchaSvg: '',
        language: 'zh-CN',
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let { captchaSvg, language } = this.state
        console.log(intl.get('login.usernamePlaceholder'))
        return (
            <div className="wrap">
                <h1>登录</h1>
                <div className="tit">
                    <span>多语言选择</span>
                    <Select value={language} style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="en-US">English</Option>
                        <Option value="zh-CN">简体中文</Option>
                    </Select>
                </div>

                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder={intl.get('login.usernamePlaceholder')}
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
                        {getFieldDecorator('code', {
                            rules: [{ required: true, message: 'Please input your verification code !' }],
                        })(
                            <Input placeholder={intl.get('login.catpchaPlaceholder')} />,
                        )}
                    </Form.Item>
                    <span dangerouslySetInnerHTML={{ __html: captchaSvg }} onClick={this.editCaptcha}></span>
                    {/* <a href="#" rel="external nofollow" onClick={this.editCaptcha}>
                        <img src='/captcha' alt="" ref="imgYzm"/>
                    </a> */}
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <a className="login-form-forgot" href="">Forgot password</a>
                        <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                        Or <a href="">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        );
    }
    componentDidMount() {
        this.changeLanguage()
        this.editCaptcha()
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                // console.log({...values})
                // console.log(document.cookie.split('=')[1])
                axios.get('/login', {
                    params: {
                        user: values.username,
                        code: values.code
                    }
                }).then(res => {
                    alert(res.data.msg)
                    // console.log(res.data)
                })
            }
        });
    }
    handleChange = (value) => {
        console.log(value)
        this.setState({
            language:value
        })
        //把改变后对应的语言的value存在本地存储内
        window.localStorage.setItem('language',value)
        //改变后刷新一下页面

        window.location.reload()
    }
    //通过封装一个方法用来改变页面需要用什么语言
    changeLanguage=()=>{
        //获取到本地存储对应的语言内容
        let currentLocale=window.localStorage.getItem('language')||'zh-CN';
        // console.log(require('../i18n/en-US.js'))
        //把对应的文件引入
        const locales={
            "en-US": require('../i18n/en-US.js').default,
            "zh-CN": require('../i18n/zh-CN.js').default,
        }
        intl.init({
            currentLocale,
            locales
        }).then(()=>{
            //此处可以先不写东西
        })

        // 再次将本地存储里读取的值在赋值一次
        this.setState({
            language:currentLocale
        })
    }
    editCaptcha = () => {
        // 只能刷新一次
        // this.refs.imgYzm.src='/captcha?d='+Math.random

        // 可以做倒计时验证
        // const timer = setInterval(() => {
        //     this.setState({ count: (count--), liked: false }, () => {
        //       if (count === 0) {
        //         clearInterval(timer);
        //         this.setState({
        //           liked: true ,
        //           count: 60
        //         })
        //       }
        //     });
        //   }, 1000);

        // 再次请求可以做到验证码的多次刷新
        axios.get('/captcha').then(res => {
            this.setState({
                captchaSvg: res.data
            })
        })
    }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);
export default WrappedNormalLoginForm