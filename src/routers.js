import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
} from 'react-router-dom';
import {object} from 'prop-types';
import lodable from 'react-loadable';
import Nav from '@/components/home/index';


export default class Router extends React.Component {
    static contextTypes = {
        store: object,
    };

    /**
     * [constructor description]
     * @param  {[type]} props   [description]
     * @param  {[type]} context [description]
     */
    constructor(props, context) {
        super(props);
        this.login = lodable({
            loader: () => {
                return import('@/pages/login/index');
            },
            loading: () => null
        });
        this.couponList = lodable({
            loader: () => {
                return import('@/pages/couponList/index');
            },
            loading: () => {
                return null
            },
        });
        this.couponSend = lodable({
            loader: () => {
                return import('@/pages/couponSend/index');
            },
            loading: () => {
                return null
            },
        });
        this.couponPlant = lodable({
            loader: () => {
                return import('@/pages/couponPlant/index');
            },
            loading: () => {
                return null
            },
        });
    };

    /**
     * [render description]
     * @return {[type]} [description]
     */
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Nav>
                        <Route path="/login" component={this.login}/>
                        <Route exact path="/" component={this.login}/>
                        <Route exact path="/couponList" component={this.couponList}/>
                        <Route exact path="/couponSend" component={this.couponSend}/>
                        <Route exact path="/couponPlant" component={this.couponSend}/>
                    </Nav>
                </Switch>
            </HashRouter>
        );
    }
}