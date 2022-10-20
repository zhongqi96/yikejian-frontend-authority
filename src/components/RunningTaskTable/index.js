import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Progress } from 'antd';
import styles from './index.less';

class RunningTaskTable extends PureComponent {
  state = {
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderCode',
      },
      {
        title: '顾客',
        dataIndex: 'experiencer',
      },
      {
        title: '产品',
        dataIndex: 'productName',
      },
      {
        title: '开始时间',
        dataIndex: 'startAt',
        sorter: true,
        render: val => <span>{moment(val).format('HH:mm')}</span>,
      },
      {
        title: '时长',
        dataIndex: 'duration',
      },
      {
        title: '进度',
        dataIndex: 'progress',
        render(val) {
          return <Progress percent={val} status='active' type="circle" width={30} />;
        },
      }
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey={record => record.key}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default RunningTaskTable;
