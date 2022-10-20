import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Select } from 'antd';
import styles from './style.less';

// const options = [];
// options.push(<Select.Option key='1'>小睡</Select.Option>);
// options.push(<Select.Option key='15'>按摩</Select.Option>);

export default class DeviceTableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      options: props.selectOptions,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
        options: nextProps.selectOptions,
      });
    }
  }
  getRowByKey(key) {
    return this.state.data.filter(item => item.key === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: values,
        });
      }
    });
  }
  toggleEditable(e, key) {
    e.preventDefault();
    const target = this.getRowByKey(key);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: [...this.state.data] });
    }
  }
  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
    this.props.onChange(newData);
  }
  newDevice = () => {
    const newData = [...this.state.data];
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      deviceCode: '',
      deviceName: '',
      products: [],
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = [...this.state.data];
    const target = this.getRowByKey(key);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  handleSelectChange(e, fieldName, key) {
    const newData = [...this.state.data];
    const target = this.getRowByKey(key);
    if (target) {
      target[fieldName] = e;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
          document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.deviceCode || !target.deviceName || !target.products || !target.roomName) {
        message.error('请填写完整设备信息。');
        e.target.focus();
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
    }, 10);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const target = this.getRowByKey(key);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: [...this.state.data] });
  }
  render() {
    const columns = [{
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'deviceName', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="设备名称"
            />
          );
        }
        return text;
      },
    }, {
      title: '设备编码',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'deviceCode', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="设备编码"
            />
          );
        }
        return text;
      },
    }, {
      title: '支持产品',
      dataIndex: 'products',
      key: 'products',
      width: '30%',
      render: (text, record) => {
        const textValue = [];
        text.map((tmp) => {
          textValue.push(tmp.toString());
        });
        return (
          <Select
            value={textValue}
            defaultValue={textValue}
            mode="multiple"
            placeholder="请选择它能支持的产品"
            onChange={e => this.handleSelectChange(e, 'products', record.key)}
            onKeyPress={e => this.handleKeyPress(e, record.key)}
            style={{ width: '100%' }}
            disabled={!record.editable || false}
          >
            {/* {options} */}
            {this.state.options}
          </Select>
        );
      },
    }, {
      title: '房间',
      dataIndex: 'roomName',
      key: 'roomName',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'roomName', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="房间"
            />
          );
        }
        return text;
      },
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={(e) => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={(e) => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newDevice}
          icon="plus"
        >
          添加
        </Button>
      </div>
    );
  }
}
