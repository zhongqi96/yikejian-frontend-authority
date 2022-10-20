import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Select } from 'antd';
import styles from './index.less';

const effectiveMap = ['error', 'success'];
class RoleTable extends PureComponent {
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
    const { data: { list, pagination }, loading, authoritiesOptions } = this.props;

    const effective = ['无效', '有效'];
    const operations = ['启用', '停用'];

    const columns = [
      {
        title: '角色名',
        dataIndex: 'roleName',
      },
      {
        title: '权限',
        dataIndex: 'authorities',
        width: 30,
        render: val => {
          const defaultValue = val.split(',');
          return (
          <Select
            defaultValue={defaultValue}
            mode="multiple"
            style={{ width: '100%' }}
            disabled
          >
            {authoritiesOptions}
          </Select>
          )
        },
      },
      {
        title: '修改时间',
        dataIndex: 'lastModifiedAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '修改人',
        dataIndex: 'lastModifiedBy',
      },
      {
        title: '状态',
        dataIndex: 'effective',
        // filters: [
        //   {
        //     text: effective[0],
        //     value: 0,
        //   },
        //   {
        //     text: effective[1],
        //     value: 1,
        //   },
        // ],
        render: (val) => (
          <div>
            <Badge status={effectiveMap[val]} text={effective[val]} />
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'roleId',
        render: (val) => (
          <div>
            <a onClick={() => this.handleEdit(val)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(val)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleValidate(val)}>启用</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleInvalidate(val)}>停用</a>
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
          rowKey={record => record.roleId}
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

export default RoleTable;
