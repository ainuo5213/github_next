import React, {Component, Fragment} from 'react'
import Router from 'next/router'
import styled from 'styled-components'

const Span = styled.span`
    color: red
`;
const events = [
  'routeChangeStart',
  'routeChangeComplete',
  'routeChangeError',
  'beforeHistoryChange',
  'hashChangeStart',
  'hashChangeComplete'
];

export default class App extends Component {
  // 编程式路由传参
  goToTestA = () => {
    Router.push({
      pathname: '/a',
      query: {
        id: 1
      }
    }, '/a/1')
  };

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

  render() {
    console.log(this.props.count);
    return (
        <Fragment>
          {/*标签式路由传参*/}
          <Span>Index</Span>
        </Fragment>
    )
  }
}
