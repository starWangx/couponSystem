
import React from 'react';
import { Dropdown, Avatar, Menu, Icon } from 'antd';
import './index.less';

export default class SiderMenuWrapper extends React.PureComponent {
  render(){
    const {other, userItem, userChange, userPhoto, userName, logOut, theme} = this.props;  
    // 用户名对应的下拉菜单
    const _menu = userItem ? userItem : (
      <Menu className='header_menu'>        
        <Menu.Item key="logout" onClick={()=>{if(logOut) logOut();}}>
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return ( sessionStorage.loginFlag ? <div className='right'>
      {other }
      <Dropdown overlay={_menu}>
        {
          userChange || (<span className='action'>
            <Avatar size="small" className='avatar' src={userPhoto || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'} />
            <span className={`${theme.isTop && theme.navTheme !== 'light' ? 'colorWhite' : ''}`}>{userName ? userName : sessionStorage.userName }</span>
          </span>)
        }                
      </Dropdown>
    </div>:null)
  }
}
