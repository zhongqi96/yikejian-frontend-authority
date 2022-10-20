import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const badgeMap = {
  NOT_SERVE: 'default',
  SERVING: 'processing',
  SERVED: 'success',
  CANCELED: 'warn',
};
const status = ['未服务', '服务中', '已服务', '已取消'];
const statusMap = {
  NOT_SERVE: '未服务',
  SERVING: '服务中',
  SERVED: '已服务',
  CANCELED: '已取消',
};
class TaskTable extends PureComponent {

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  render() {
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      // {
      //   title: '订单号',
      //   dataIndex: 'orderCode',
      // },
      {
        title: '顾客',
        dataIndex: 'experiencer',
      },
      {
        title: '预约时间',
        dataIndex: 'bookedTime',
      },
      {
        title: '产品',
        dataIndex: 'productName',
      },
      {
        title: '状态',
        dataIndex: 'orderItemStatus',
        filters: [
          {
            text: status[0],
            value: 'NOT_SERVE',
          },
          {
            text: status[1],
            value: 'SERVING',
          },
          {
            text: status[2],
            value: 'SERVED',
          },
          {
            text: status[3],
            value: 'CANCELED',
          },
        ],
        render(val) {
          return <Badge status={badgeMap[val]} text={statusMap[val]} />;
        },
      },
      {
        title: '操作',
        render: () => (
          <div>
            <a href="">开始</a>
          </div>
        ),
      },
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

export default TaskTable;
