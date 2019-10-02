### 目录结构
1. pages(必需)：<font color="red">pages</font>目录是nextjs中最终要的一个目录，这个目录的每一个文件都会对应到每一个页面，可以根据地址栏的路由进行跳转。若pages下的js文件在一个目录下，那么nextjs默认会将这个目录也当作路由的路径。  
2. components(非必需)：<font color="red">components</font>目录存放的是一些公用的组件，这些代码不能放在pages下，不然的话就会以页面的形式进行导出。
3. lib(非必需)：<font color="red">lib</font>目录存放一些工具方法，比如util等等。
4. static(非必需)：<font color="red">static</font>目录存放一些静态资源文件，比如图片和公共的css样式。
### next的默认文件
1. index.js：nextjs的pages下默认入口文件，这个文件会对应浏览器地址栏为根路径的那个页面
2. _app.js：nextjs的全局组件，一般来说我们需要对这个组件进行重写，重写的时候一般进行一些公共的操作，比如：导入全局的css、给页面传入数据(执行每个页面的``getInitialProps``方法)、用``componentDidCatch``进行自定义错误处理等等
3. _error.js：nextjs的错误页面，这个页面也可以用来重写，当路由不存在时就会显示该页面。
4. _document.js：nextjs只在服务端运行的js文件，客户端运行时不起作用。一般来说它用来修改服务端渲染给客户端的html文件的格式，比如我们可以在这个js文件加入``styled-components``等``style-in-js``方案配置、修改返回给客户端的html（给客户端的html文件加上title等等），
### 路由跳转
#### 标签式路由跳转
&#8195;&#8195;在nextjs中我们使用next内置的Link组件进行跳转，而是要Link组件本身不渲染组件，而要根据传入的组件进行渲染然后进行跳转。但是请注意这只是前端的跳转，相当于``react-router-dom``的Link组件
```javascript
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Link href="/a">
                    <button>asd</button>
                </Link>
            </Fragment>
        )
    }
}
```
&#8195;&#8195;注意：**Link组件下的children只能是单独的一个，而不能是多个子节点**，因为Link组件是给他的子节点增加点击事件，如果需要给多个组件绑定点击事件，可以用一个根节点包裹起来，比如：
```javascript
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Link href='/a' title='aaa'>
                    <Fragment>
                        <button>to a</button>
                        <button>to A</button>
                    </Fragment>
                </Link>
            </Fragment>
        )
    }
}
```
#### 编程式路由跳转
&#8195;&#8195;编程式路由跳转需要借助next的router模块，使用方法和``react-router-dom``的``history``模式一样，可以通过``push、replace``等等方法进行跳转
```javascript
import React, {Component, Fragment} from 'react'
import Router from 'next/router'
export default class App extends Component {
    goToTestB = () => {
        Router.push('/test/b')
    };
    goToTestC = () => {
        Router.push({
            pathname: '/test/c',
        })
    }
    render() {
        return (
            <Fragment>
                <button onClick={this.goToTestB}>this is a</button>
                <button onClick={this.goToTestC}>this is c</button>
            </Fragment>
        )
    }
}
```
### 动态路由
&#8195;&#8195;动态路由指的是：切换页面时我们需要给下一个页面传递一些参数，页面根据这些参数进行相关的渲染。  
&#8195;&#8195;在``react-router-dom``中我们可以使用``params``和``query``的方式进行动态数据的传递，而在next的动态路由跳转中则只能使用``query``来传递相关参数。

```javascript
// index.js
import React, {Component, Fragment} from 'react'
import Link from 'next/link'
import Router from 'next/router'
export default class App extends Component {
    // 编程式路由传参
    goToTestC = () => {
        Router.push({
            pathname: '/a',
            query: {
                id: 1
            }
        })
    }
    render() {
        return (
            <Fragment>
                {/*标签式路由传参*/}
                <Link href='/a?id=1'>
                    <button>to a</button>
                </Link>
                <button onClick={this.goToTestC}>to a</button>
            </Fragment>
        )
    }
}

// a.js
import React, {Component, Fragment} from 'react'
import {withRouter} from 'next/router'
class App extends Component {
    render() {
        // 当使用withRouter这个高阶组件时，会在props组件的props上添加一个router对象，
        // 根据router对象就可以得到query参数
        const {router} = this.props;
        console.log(router.query.id)
        return (
            <Fragment>
                <button onClick={this.goToTestB}>this is a</button>
            </Fragment>
        )
    }
}
// 使用高阶组件将APP装饰以下。如果开启了装饰器，则可以使用装饰器模式
export default withRouter(App)
```
### 路由映射
&#8195;&#8195;路由映射是指：比如有一个博文的path是``/post?id=2&articleId=199``，这样的路由看起来是不友好的。我们想要的是``:/post/2/199``，这样的路径。从前种方法到后种方法之间的转换就叫做路由映射。  
#### 标签式路由映射  
&#8195;&#8195;在next中由于不能传递``params``，所以我们需要使用next种Link组件提供的**as**属性，在as属性中就可以通过传递``params``进行后面种类的path。  
&#8195;&#8195;在next的Link组件中的``as``和``href``的区别在于：as是浏览器地址栏**显示**的path，并不是真正的path；而href才是真正的跳转路径（服务端的路径）。总的来说as是客户端显示的路径，而href是服务端真实跳转的路径。
#### 编程式路由映射
&#8195;&#8195;在next的Router对象中我们也可以使用路由映射使客户端显示的路径变得更加简洁。即在``push``或其他方式进行跳转的时候传入第二个路径，这个路径就是在客户端地址栏显示的路径。
```javascript
import React, {Component, Fragment} from 'react'
import Router from 'next/router'
import Link from 'next/link'

export default class App extends Component {
    goToTestA = () => {
        Router.push({
            pathname: '/a',
            query: {
                id: 1
            }
        }, '/a/1')
    };

    render() {
        return (
            <Fragment>
                <Link href='/a?id=1' as='/a/1'>
                    <button>to a</button>
                </Link>
                <button onClick={this.goToTestA}>to a</button>
            </Fragment>
        )
    }
}
```
#### 路由映射存在的问题
&#8195;&#8195;路由映射存在的一个问题就是当我们通过路由映射跳转页面之后刷新，会找不到页面。因为这个时候我们刷新时服务器会根据我们地址栏的``path``在pages文件里面查找a文件夹的1.js文件，发现并不存在这个文件，所以浏览器会报404的错误。  
&#8195;&#8195;那为什么之前我们却能成功进行跳转呢？因为我们实现的是一个单页应用，使用next提供的Link组件或Router对象的方法进行跳转时我们并没有发出请求，也没有刷新浏览器，是直接跳转的，这个时候并不会出现错误。但是当我们刷新页面时发出了请求，服务器就会根据路径在pages下寻找文件。  
#### 路由映射问题的解决方法
&#8195;&#8195;路由映射存在的问题就是在于对服务器发起请求的与否，所以我们需要在使用路由映射跳转的时候，需要使用``koa``进行相关的拦截，然后更新服务端的路径  
&#8195;&#8195;以下例子是koa集成next服务器的例子：
```javascript
const Koa = require('koa');
const next = require('next');
const Router = require('koa-router');
// 创建一个app，并指定为开发状态
const dev = process.env.NODE_ENV !== 'production';
const app = next({
    dev
});
const handle = app.getRequestHandler();
// 等pages下面的所有页面编译完成之后启动服务，响应请求
app.prepare().then(() => {
    // 实例化KoaServer
    const server = new Koa();
    const router = new Router();
    server.use(router.routes());
    // 根据浏览器地址栏请求的params来进行相关query的配置
    router.get('/a/:id', async ctx => {
        const id = ctx.params.id;
        await app.render(ctx.req, ctx.res, '/a', {id});
        ctx.respond = false
    });
    // 通配符
    router.get('*', async ctx => {
        await handle(ctx.req, ctx.res);
        // hack手段，兼容node底层的req和res
        ctx.respond = false
    });
    // 使用中间件
    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next()
    });
    // 监听端口
    server.listen(3000, () => {
        console.log('koa server listening on 3000')
    });
});

```
### 路由钩子
&#8195;&#8195;路由钩子指的是在next中进行路由跳转时，执行的函数。分别是：
1. routeChangeStart：开始跳转时触发。
2. routeChangeComplete：跳转完成之后触发。
3. routeChangeError：跳转到一个不存在的路径触发。
4. beforeHistoryChange：启用history路由，在跳转成功前触发。
5. hashChangeStart：启用hash路由时，在开始跳转时触发
6. hashChangeComplete：启用hash路由时，在跳转成功后触发。
```javascript
// index.js
const events = [
    'routeChangeStart',
    'routeChangeComplete',
    'routeChangeError',
    'beforeHistoryChange',
    'hashChangeStart',
    'hashChangeComplete'
];

emitEvent = (type) => {
    return (...args) => {
        console.log(type, ...args)
    }
};

componentDidMount() {
    events.forEach(event => {
            Router.events.on(event, this.emitEvent(event))
    })
}
```
### next获取数据的方式
&#8195;&#8195;在next服务端渲染获取数据使用的是``getInitialProps``，这个方法是一个静态方法，是next提供的一个内置的方法。这是一个非常重要的静态方法，它能够为我们同步客户端和服务端的数据，所以我们应该尽量将数据相关的内容的操作放到``getInitialProps``去做。  
&#8195;&#8195;在``getInitialProps``里面返回的数据都会作为``props``传递到实例出的组件。但是请注意：**只有pages下的页面组件才会调用getInitialProps这个静态方法**，而放在components下的组件则不会存在该方法，除此之外而且这个方法在服务端和客户端都会被执行。  
&#8195;&#8195;这时候打开我们的浏览器调试工具``network``，点击a页面请求的``preview``，我们可以很清楚的看到有个返回的数据是有刚刚在``getInitProps``方法返回的数据的，这是因为react的服务端渲染有一个``hydrate``方法，他会复用我们在服务端已经渲染好的html。  
&#8195;&#8195;注意：``getInitialProps``方法在服务端和客户端都仅仅只执行一次。
```javascript
import React, {Component, Fragment} from 'react'
import Router, {withRouter} from 'next/router'
class App extends Component {
    static getInitialProps = async () => {
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({name: 'ainuo'})
            }, 1000)
        });
        return await promise
    }
    render() {
        console.log(this.props.name)
        return (
            <Fragment>
                 <button>{this.props.name}</button>
            </Fragment>
        )
    }
}

export default withRouter(App)
```
### 自定义APP
&#8195;&#8195;自定义APP即重写_app.js，来覆盖next提供的默认的_app.js。那么重写_app.js的作用是什么呢？  
1. 固定layout
2. 保持一些公用的状态，比如redux的使用。
3. 给页面传入一些自定义的数据
4. 自定义错误处理
#### 传递自定义数据
&#8195;&#8195;传递自定义数据即执行每个对象上得``getInitialProps``方法，然后传递到``Component``页面。
```javascript
import App from 'next/app'
import 'antd/dist/antd.css'

class myApp extends App {
// 这里方法在每次切换页面都会执行
    static getInitialProps = async ({Component}) => {
        let pageProps = {};
        // 判断当前页面是否存在getInitialProps方法
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps()
        }
        return {pageProps}
    };

    render() {
        // 这个Component即渲染的页面
        const {Component, pageProps} = this.props;
        console.log(Component);
        return (
            <Component {...pageProps} name={'jocky'}/>
        )
    }
}

export default myApp
```
#### 固定Layout
```javascript
import React from 'react'
import App from 'next/app'

class Layout extends React.Component {
  render () {
    const { children } = this.props
    return <div className='layout'>{children}</div>
  }
}

export default class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  }
}
```
### 自定义document
&#8195;&#8195;``_document``文件只会在服务端渲染的时候才会被调用，是用来修改服务端渲染的文档内容，一般来配合第三方``css-in-js``方案使用  
```javascript
import Document, {Html, Head, Main, NextScript} from 'next/document'
import React from "react";

export class MyDocument extends Document {
    // 不必重写该方法，重写了就必须执行Document.getInitialProps方法
    static getInitialProps = async () => {
        const pageProps = await Document.getInitialProps();
        return {
            ...pageProps
        }
    };
    // 不必需重写render方法，重写了就必须包含Html、Head、Main、NextScript等标签
    render() {
        return (
            <Html>
            <Head>
                <title>自定义document</title>
                <style>{`
                    .test {
                        color: red
                    }
                    `}</style>
            </Head>
            <body className='test'>
            <Main/>
            <NextScript/>
            </body>
            </Html>
        )
    }
}
```
#### styled-components的集成
&#8195;&#8195;``styled-components``的集成要修改``.babelrc``和``_document.js``的配置。
``.babelrc``:
```json
{
  "presets": ["next/babel"],
  "plugins": [["styled-components", { "ssr": true }]]
}
``` 
``_document.js``:
```javascript
import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
}
```
``test.js``
```javascript
import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
const Span  = styled.span`
    color: red
`;

export default class App extends Component {
    render() {
        return (
            <Fragment>
                <Span>Index</Span>
            </Fragment>
        )
    }
}
```
### lazyloading的运用
&#8195;&#8195;在next中，pages下的所有页面都被切割成了不同的模块，当我们访问某个页面的时候才会去加载这个js文件，所以大部分时候这个功能已经够用了。但是我们仍然希望自己能够去控制某些模块的lazyloading。
#### 异步加载模块
```javascript
import React, {Component, Fragment} from 'react'
class App extends Component {
    static getInitialProps = async () => {
        // 执行到该行的时候才会去加载moment
        const moment = await import('moment');
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name: 'ainuo',
                    // 使用的时候使用default方法
                    time: moment.default(Date.now() - 60 * 1000).fromNow()
                })
            }, 2000)
        });
        return await promise
    };

    render() {
        const {name, time} = this.props;
        return (
            <Fragment>
                this is {name}, {time}
            </Fragment>
        )
    }
}

export default App
```
#### 异步加载组件
```javascript
import React, {Component, Fragment} from 'react'

import dynamic from 'next/dynamic'
// 这里其实是es2019Api的dynamic引入
const Comp = dynamic(import('../components/comp'));

class App extends Component {
    static getInitialProps = async () => {
        // 执行到该行的时候才会去加载moment
        const moment = await import('moment');
        const promise = new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name: 'ainuo',
                    // 使用的时候使用default方法
                    time: moment.default(Date.now() - 60 * 1000).fromNow()
                })
            }, 2000)
        });
        return await promise
    };

    render() {
        const {name, time} = this.props;
        return (
            <Fragment>
                this is {name}, {time}
                {/*只有当渲染Comp的时候才会去执行改代码*/}
                <Comp/>
            </Fragment>
        )
    }
}

export default App
```
### next服务端渲染流程
![SSR渲染流程](./static/SSR渲染流程.jpg)
