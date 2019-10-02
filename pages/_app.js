/**
 * Created by 16609 on 2019/9/30
 * 重写_app，让其一开始就加载全局的css样式
 */

import App from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/layout'

class myApp extends App {
  render() {
    // 这个Component即渲染的页面
    const {Component, pageProps} = this.props;
    console.log(Component);
    return (
        <Layout>
          <Component {...pageProps} name={'jocky'} {...this.state}/>
        </Layout>
    )
  }

  state = {
    count: 1
  };

  // 这里方法在每次切换页面都会执行
  static getInitialProps = async ({Component, ctx}) => {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {pageProps}
  };
}

export default myApp
