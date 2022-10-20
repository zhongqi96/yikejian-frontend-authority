import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from '../../components/DescriptionList';
import styles from './BasicProfile.less';

const { Description } = DescriptionList;

@connect(state => ({
  store: state.store,
}))
export default class StoreProfile extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/fetchStore',
      type: 'store/fetchProduct',
      type: 'store/fetchDevice',
    });
  }

  render() {
    const { store: { devicesData, fetchDeviceLoading } } = this.props;
    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      if (index === devicesData.length) {
        obj.props.colSpan = 0;
      }
      return obj;
    };
    const devicesColumns = [{
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      render: renderContent,
    }, {
      title: '设备编号',
      dataIndex: 'code',
      key: 'code',
      render: renderContent,
    }, {
      title: '支持的产品',
      dataIndex: 'products',
      key: 'products',
      render: renderContent,
    },
    ];
    return (
      <PageHeaderLayout title="店铺详情页">
        <Card bordered={false}>
          <DescriptionList size="large" title="基本信息" style={{ marginBottom: 32 }}>
            <Description term="店铺名称">店铺01</Description>
            <Description term="店铺地址">xxxxx</Description>
            <Description term="店铺经、纬度">12.34, 43.21</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="店铺产品" style={{ marginBottom: 32 }}>
            <Description term="">小睡</Description>
            <Description term="">按摩</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>店铺设备</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={fetchDeviceLoading}
            dataSource={devicesData}
            columns={devicesColumns}
            rowKey="id"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
