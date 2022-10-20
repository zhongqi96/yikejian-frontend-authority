import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const badgeMap = {
  CREATED: 'processing',
  CANCELLED: 'warning',
  PAID: 'success',
  REFUNDED: 'error',
  FINISHED: 'default'
};
const statusMap = {
  CREATED: '已创建',
  CANCELLED: '已取消',
  PAID: '已支付',
  REFUNDED: '已退款',
  FINISHED: '已完成'
};
class OrderTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  handleValidate = (key) => {
    this.props.validate(key);
  }

  handleInvalidate = (key) => {
    this.props.inValidate(key);
  }

  handleDelete = (key) => {
    this.props.delete(key);
  }

  handleEdit = (key) => {
    this.props.edit(key);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderCode',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
      },
      {
        title: '最近修改时间',
        dataIndex: 'lastModifiedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '最近修改人',
        dataIndex: 'lastModifiedBy',
      },
      {
        title: '状态',
        dataIndex: 'orderStatus',
        render: (val) => (
          <div>
            <Badge status={badgeMap[val]} text={statusMap[val]} />
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'orderId',
        render: (val) => (
          <div>
            <a onClick={() => this.handleEdit(val)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(val)}>取消</a>
            {/* <Divider type="vertical" />
            <a onClick={() => this.handleValidate(val)}>启用</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleInvalidate(val)}>停用</a> */}
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.orderId}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default OrderTable;
