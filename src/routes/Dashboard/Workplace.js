import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, Avatar, Button, Form, Input } from 'antd';
import TaskTable from '../../components/TaskTable';
import RunningTaskTable from '../../components/RunningTaskTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import EditableLinkGroup from '../../components/EditableLinkGroup';
import { Radar } from '../../components/Charts';

import styles from './Workplace.less';

const FormItem = Form.Item;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  task: state.task,
  user: state.user,
}))
@Form.create()
export default class Workplace extends PureComponent {
  state = {
    formValues: {},
    queryParams: {
      orderItem: {},
      pagination: {
        current: 1,
        pageSize: 10,
      },
      sorter: {},
      running: false,
    },
    runningParams: {
      orderItem: {},
      pagination: {
        current: 1,
        pageSize: 10,
      },
      sorter: {},
      running: true,
    },
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { runningParams: params } = this.state;
    const newParams = {
      ...params,
      orderItem: {
        orderItemStatus: 1,
      },
    }
    dispatch({
      type: 'task/fetchRunning',
      payload: {
        params: JSON.stringify(newParams),
      }
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { queryParams: params } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      const newParams = {
        ...params,
        orderItem: values,
      };
      this.setState({
        formValues: values,
        queryParams: newParams,
      });

      dispatch({
        type: 'task/fetch',
        payload: {
          params: JSON.stringify(newParams),
        },
      });
    });
  }

  pageHeaderContent(currentUser){
    const currentUserName = currentUser.name ? currentUser.name : '';
    return (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>你好，{currentUserName}，祝你开心每一天！</div>
        </div>
      </div>
    );
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={18} style={{ marginLeft: 0, marginRight: 0 }}>
          <Col>
            <FormItem label="订单编号">
              {getFieldDecorator('order.orderCode')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col>
            <FormItem label="会员手机号">
              {getFieldDecorator('order.mobileNumber')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleTaskTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, queryParams: params } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const newParams = {
      ...params,
      pagination: pagination,
    };
    if (filters.length === 0){
      newParams.orderItem = {
        ...formValues,
      }
    } else {
      newParams.orderItem = {
        ...formValues,
        ...filters,
      }
    }
    if (sorter.field) {
      newParams.sorter = {
        field: sorter.field,
        order: sorter.order,
      };
    }
    this.setState({
      queryParams: newParams,
    });

    dispatch({
      type: 'task/fetch',
      payload: {
        params: JSON.stringify(newParams),
      }
    });
  }

  handleRunningTaskTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { runningParams: params } = this.state;

    const newParams = {
      ...params,
      pagination: pagination,
    };
    if (sorter.field) {
      newParams.sorter = {
        field: sorter.field,
        order: sorter.order,
      };
    }
    this.setState({
      runningParams: newParams,
    });

    dispatch({
      type: 'task/fetchRunning',
      payload: {
        params: JSON.stringify(newParams),
      }
    });
  }

  render() {
    const {
      task: {
        tasks: tasks,
        loading: loading,
        runningTasks: runningTasks,
        runningLoading: runningLoading,
      },
      user: {
        currentUser,
      }
    } = this.props;

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>今日任务数</p>
          <p>56</p>
        </div>
        <div className={styles.statItem}>
          <p>已完成</p>
          <p>16</p>
        </div>
        <div className={styles.statItem}>
          <p>进行中</p>
          <p>10</p>
        </div>
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    return (
      <PageHeaderLayout content={this.pageHeaderContent(currentUser)}
        // extraContent={extraContent}
      >
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="查询服务"
              extra={<Link to = "/order/form" > 创建订单 </Link>}
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  {this.renderForm()}
                </div>
                <TaskTable loading={loading} data={tasks} onChange={this.handleTaskTableChange}/>
              </div>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="进行中的服务"
              // extra={<Link to = "/task/list" > 全部服务 </Link>}
              style={{ marginBottom: 24 }}
              bordered={false}
            >
              <RunningTaskTable loading={runningLoading} data={runningTasks} onChange={this.handleRunningTaskTableChange}/>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
