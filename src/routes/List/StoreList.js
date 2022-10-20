import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, message } from 'antd';
import { routerRedux, Route, Switch } from 'dva/router';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './StoreList.less';

@connect(state => ({
  store: state.store,
  inventory: state.inventory,
}))
export default class StoreList extends PureComponent {
  componentDidMount() {
    const { store } = this.props;
    this.props.dispatch({
      type: 'store/getStores',
      payload: store.storeId,
    });
  }

  handleClickEdit(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/getStore',
      payload: {storeId: id},
    });
    // this.props.dispatch(routerRedux.push(`/info/store/form`));
  }

  handleClickProfile(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'inventory/init',
      payload: {storeId: id},
    });
    // this.props.dispatch(routerRedux.push(`/info/store/profile`));
  }

  handleClickDevice(id) {
    this.props.dispatch(routerRedux.push(`/info/store/device`));
  }

  handleClickDelete(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/putStore',
      payload: {storeId: id, deleted: 1},
    });
  }

  render() {
    const { store: { list, loading } } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          查看、管理店铺信息
        </p>
        <div className={styles.contentLink}>
          <a>
            <Icon type="link" />
            快速开始
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        {/* <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" /> */}
      </div>
    );

    return (
      <PageHeaderLayout
        title="店铺列表"
        content={content}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={store => (store ? (
              <List.Item key={store.storeId}>
                <Card hoverable className={styles.card}
                  actions={[
                    <a onClick={() => this.handleClickEdit(store.storeId)}>编辑</a>,
                    // <a onClick={() => this.handleClickDevice(store.storeId)}>添加设备</a>,
                    <a onClick={() => this.handleClickDelete(store.storeId)}>删除</a>]}>
                  <Card.Meta
                    // avatar={<img alt="" className={styles.cardAvatar} src={store.avatar} />}
                    title={<a href="#">{store.storeName}</a>}
                    description={(
                      <Ellipsis className={styles.item} lines={3}>{store.address}</Ellipsis>
                    )}
                    onClick={() => this.handleClickProfile(store.storeId)}
                  />
                </Card>
              </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" className={styles.newButton} onClick={() => this.handleClickEdit()}>
                    <Icon type="plus" /> 新增店铺
                  </Button>
                </List.Item>
              )
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
