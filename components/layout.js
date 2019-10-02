import React, {Fragment} from "react";
import Link from 'next/link'
import {Button} from 'antd'

export default ({children}) => {
    return (
        <Fragment>
            <header>
                <Link href='/a?id=1' as='/a/1'>
                    <Button>A</Button>
                </Link>
                <Link href='/test/b' as='/test/b'>
                    <Button>B</Button>
                </Link>
            </header>
            {children}
        </Fragment>
    )
}
