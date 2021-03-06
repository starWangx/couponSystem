import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {is, fromJS} from 'immutable';
import {object, func} from 'prop-types';
import {Card, Button, Divider, message, Drawer, Spin, Badge, Popconfirm} from 'antd';
import {PageHeaderLayout, TableSearch, StandardTable, TableCommon, Utils} from 'dt-antd';
import Define from './define';
import {getList} from './action';
import tableCommon from '../../utils/tableCommon.js';
import '@/style/list.less';
import NewForm from './edit';
import api from '../../api/api'

class Home extends Component {
  static propTypes = {
    oneSupplierReducer: object,
    getList: func,
  };
  state = {
    showDrawer: false, // 是否显示抽屉编辑
    showDetail: false, // 是否显示详情
    showAccount: false, // 是否显示添加账号
    showTwo: false, // 是否显示添加子公司
    searchList: null, // 搜索条件
    tips: false,
    currentNo: 1, // 当前页码
    pageSize: 10, // 每页显示条数,
  }

  /**
   * [shouldComponentUpdate 如果state值没有改变时就算调用了setState方法，页面也不会重新渲染]
   * @param  {[type]} nextProps [description]
   * @param  {[type]} nextState [description]
   * @return {[type]}           [description]
   */
  shouldComponentUpdate(nextProps, nextState) {
    return !is(fromJS(this.props), fromJS(nextProps)) || !is(fromJS(this.state), fromJS(nextState))
  }

  /**
   * [componentDidMount 加载render方法之前,获取所有用户列表]
   * @return {[type]} [description]
   */
  componentDidMount() {
    this.props.getList({
      pageNo: this.state.currentNo,
      pageSize: this.state.pageSize,
    });
  }

  /**
   * [handleSearch 点击搜索之后的回调函数,重新请求用户列表]
   * @param  {[type]} values [description]
   * @return {[type]}        [description]
   */

  handleSearch = (values) => {
    tableCommon.tableSearch({
      state: this.state,
      values,
      callBack: (json) => {
        this.setState(json);
        this.props.getList({
          ...json.searchList,
          pageNo: 0,
          pageSize: json.pageSize
        });
      }
    });
  }

  /**
   * [handleSearch 点击重置之后的回调函数]
   * @return {[type]}        [description]
   */
  handleFormReset = () => {
    this.props.getList({
      pageNo: this.state.currentNo,
      pageSize: this.state.pageSize
    });
    this.setState({
      searchList: null,
      currentNo: 1,
    })
  }
  /**
   * [表格点击编辑之后 description]
   * @param  {[type]} pagination [description]
   * @param  {[type]} filtersArg [description]
   * @param  {[type]} sorter     [description]
   * @return {[type]}            [description]
   */
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    tableCommon.tableChange({
      state: this.state,
      pagination,
      callBack: (json) => {
        if (json.searchList.rangeTime) {
          json.searchList.startTime = json.searchList.rangeTime[0]
          json.searchList.endTime = json.searchList.rangeTime[1]
          delete json.searchList.rangeTime;
        }

        this.setState(json, () => {
          this.props.getList({
            ...json.searchList,
          });
        });

      }
    });
  }

  stop = (id, state) => async () => {


    let result = await api.updateCoupon({
      state: state === 'SENDING' ? 'PAUSE' : 'SENDING',
      id
    });
    if (result.message === 'success') {

      message.success(result.message);
      console.log(this.state);
      this.props.getList({
        ...this.state.searchList,
        pageNo: this.state.currentNo,
        pageSize: this.state.pageSize,
      });

    } else {
      this.setState({
        btnDisabled: false
      })
      message.error(result.message);
    }

  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {
    const {tips, currentNo, pageSize, showDrawerId, showDetail, showDrawer, showAccount, record} = this.state;
    const {loading, list} = this.props.couponReducer;


    let {breadMenu, searchMenu} = Define;
    searchMenu.searchCallBack = this.handleSearch; // 查询的回调函数
    searchMenu.resetCallBack = this.handleFormReset; // 重置的回调函数
    // 列表表头
    // couponCode: "drehgwe25dsda"
    // couponName: "50加油卡1"
    // createTime: "2019-07-24 05:35:08"
    // createType: false
    // id: 3
    // lastModifyUser: "caimx"
    // lockedCount: 0
    // platformId: 1
    // platformName: "测试平台"
    // state: "SENDING"
    // stockCount: 0
    // totalCount: 0
    // updateTime: "2019-07-31 06:39:17"
    // validEnd: "2019-09-08 01:12:00"
    // validStart: "2019-07-08 00:11:00"
    const columns = [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
      },
      {
        title: '券名称',
        dataIndex: 'couponName',
        key: 'couponName',
      },
      {
        title: '券平台',
        key: 'platformName',
        dataIndex: 'platformName',
      },
      {
        title: '入库方式',
        key: 'createType',
        dataIndex: 'createType',
        render: () => "批量导入"
      },

      {
        title: '入库数量',
        key: 'totalCount',
        dataIndex: 'totalCount',
      },
      {
        title: '库存数量',
        key: 'stockCount',
        dataIndex: 'stockCount',
      },
      {
        title: '已发送数量',
        key: 'sendCount',
        dataIndex: 'sendCount',
        render: (t, record) => {
          return record.totalCount - record.stockCount
        }
      },

      {
        title: '锁定数量',
        key: 'lockedCount',
        dataIndex: 'lockedCount',
      },
      {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        render: (text, record) => {
          if (text === 'SENDING') {
            return '发放中'
          } else if (text === 'CLOSED') {
            return '已结束'
          } else {
            return '暂停中'
          }
        }
      },
      {
        title: '截止时间',
        key: 'validEnd',
        dataIndex: 'validEnd',
        render: (text, record) => {
          return text && text.slice(0, 19)
        }
      },
      {
        title: '更新时间',
        key: 'updateTime',
        dataIndex: 'updateTime',
        render: (text, record) => {
          return text && text.slice(0, 19)
        }
      },
      {
        title: '更新人',
        key: 'lastModifyUser',
        dataIndex: 'lastModifyUser',
      },
      {
        title: '操作',
        key: 'deal',
        render: (text, record) => (
            record.state === 'CLOSED' ? <a onClick={() => this.props.history.push(`/couponSend/${record.id}`)}>发放明细</a>

              : <Fragment>
                <a onClick={() => {
                  this.setState({
                    showDrawer: true,
                    showDrawerId: record.id,
                    record: record,
                    id: record.id,
                    type: null
                  })
                }}>编辑</a>
                <Divider type="vertical"/>
                <Popconfirm placement="top"
                            title={record.state === 'SENDING' ? '确认要暂停吗' : '确认要启用吗'}
                            onConfirm={this.stop(record.id, record.state)}
                            okText='确认'
                            cancelText='取消'
                >
                  {
                    record.state === 'SENDING' ? <a>暂停</a> : <a>启用</a>
                  }
                </Popconfirm>
                <Divider type="vertical"/>
                <a onClick={() => this.props.history.push(`/couponSend/${record.id}`)}>发放明细</a>
                <Divider type="vertical"/>
                <a onClick={() => this.props.history.push(`/codeList/${record.id}/${JSON.stringify(record)}`)}>码库</a>
                {/*<Divider type="vertical"/>
                <a onClick={() => {
                  this.setState({
                    showDrawer: true,
                    showDrawerId: null,
                    record: record,
                    id: record.id,
                    type: 'import'
                  })
                }}>导入券码</a>*/}
              </Fragment>

        ),
      },
    ];
    // 定义表格的数据
    const data = {
      list: list && list.data,
      pagination: {
        total: list ? list.total : 1,
        pageSize: pageSize,
        current: currentNo,
      },
    }
    return (
      <PageHeaderLayout
        nav={breadMenu}
      >
        <Spin tip={tips} spinning={tips ? true : false}>
          <Card bordered={false}>
            <div className='tableList'>
              <div className='tableListForm'>
                <TableSearch {...searchMenu} />
              </div>
              <div className='tableListOperator'>
                <Button icon="export" onClick={() => {
                  //window.location.href = "http://shande.xajhzx.cn/service/export";
                  // urlEncode
                  if(this.state.checkedIds){
                    window.location.href = "http://shande.xajhzx.cn/service/coupon/export?couponIds=" + this.state.checkedIds
                  }else{
                    window.location.href = "http://shande.xajhzx.cn/service/coupon/export"
                  }
                }}>
                  导出
                </Button>
                <Button type="primary" icon="plus" onClick={() => {
                  this.setState({
                    showDrawer: true,
                    showDrawerId: null,
                    record: null,
                    type: null
                  })
                }}>
                  新增
                </Button>
              </div>
              <StandardTable
                loading={loading} // 显示加载框
                data={data}
                columns={columns}
                rowKey={columns => columns.id}
                onChange={this.handleStandardTableChange}
                noCheck={false}
                onSelectRow={data => {
                  if(data.length>0){
                   let ids =  data.map((coupon)=>(coupon.id));
                    this.setState({
                      checkedIds: ids.join()
                    })
                  }

                }}
              />
            </div>
          </Card>
          <Drawer
            title={!this.state.type ? (showDrawerId ? '编辑券' : '新增券') : '导入券码'}
            width='560'
            visible={showDrawer}
            maskClosable={false}
            onClose={() => {
              this.setState({
                showDrawer: false,
                showDrawerId: null,
                record: null
              });
            }}
          >
            {showDrawer && <NewForm
              id={this.state.id}
              record={record}
              type={this.state.type}
              onClose={(bool) => {
                this.setState({
                  showDrawer: false,
                  showDrawerId: null,
                  record: null
                });
                // 如果点击的确定，则刷新列表
                let searchList = this.state.searchList || {};

                if (bool) {
                  this.props.getList({
                    pageNo: this.state.currentNo,
                    pageSize: this.state.pageSize,
                    ...searchList
                  });
                }
              }}
            />}
          </Drawer>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

export default connect((state) => ({
  couponReducer: state.couponReducer
}), {
  getList,
})(Home);
