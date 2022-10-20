import React, { PureComponent } from 'react';
import { Card, Button, Form, Icon, Col, Row, DatePicker, TimePicker, Input, Select, Popover, Checkbox } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import DeviceTableForm from './DeviceTableForm';
import styles from './style.less';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const timeFormat = 'HH:mm';

const fieldLabels = {
  // 店铺字段
  storeName: '店铺名称',
  address: '详细地址',
  longitude: '经度',
  latitude: '纬度',
  // 产品字段
  products: '选择产品',
};

// const deviceData = [{
//   key: '1',
//   code: '00001',
//   name: 'John Brown',
//   products: ['1', '2'],
// }, {
//   key: '2',
//   code: '00002',
//   name: 'Jim Green',
//   products: ['1'],
// }, {
//   key: '3',
//   code: '00003',
//   name: 'Joe Black',
//   products: ['2'],
// }];

@connect(state => ({
  store: state.store,
}))
@Form.create()
export default class StoreForm extends PureComponent {
  state = {
    width: '100%',
    // productOptions: [],
    checkedList: [],
    indeterminate: true,
    checkAll: false,
  };
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'store/getProducts',
    });
    // const { store: { products, checkedProducts } } = this.props;
    // const productOptions = [];
    // products.map((product) => {
    //   productOptions.push({label: product.productName, value: product.productId});
    // });
    // const checkedList = [];
    // checkedProducts.map((checkedProduct) => {
    //   checkedList.push(checkedPproduct.productId);
    // });
    // this.setState ({
    //   productOptions,
    //   checkedList,
    // });
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     if (!err) {
  //       this.props.dispatch({
  //         type: 'store/postStore',
  //         payload: values,
  //       });
  //     }
  //   });
  // }
  onProductChange = (checkedList) => {
    const { store: { productOptions } } = this.props;
    this.setState({
      checkedList: checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < productOptions.length),
      checkAll: checkedList.length === productOptions.length,
    });
  }
  onCheckAllProductChange = (e) => {
    const { store: { productOptions } } = this.props;
    const checkedList = [];
    if(e.target.checked){
      productOptions.map((productOption) => {
        checkedList.push(productOption.value);
      });
    }
    this.setState({
      checkedList: checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  render() {
    const { form, dispatch } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const { store: { store, submitting, products, productOptions, checkedProducts, productsLoading } } = this.props;

    const deviceProductOptions = [];
    products.map((product) => {
      deviceProductOptions.push(<Select.Option key={product.productId}>{product.productName}</Select.Option>);
    });

    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          if(store.storeId){
            dispatch({
              type: 'store/editStore',
              payload: {
                ...values,
                storeId: store.storeId,
                startTime: values['startTime'].format('HHmm'),
                endTime: values['endTime'].format('HHmm'),
              },
            });
          } else {
            dispatch({
              type: 'store/postStore',
              payload: {
                ...values,
                startTime: values['startTime'].format('HHmm'),
                endTime: values['endTime'].format('HHmm'),
              },
            });
          }
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <PageHeaderLayout
        title="编辑店铺"
        content="填写店铺信息："
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='店铺名称'>
                  {getFieldDecorator('storeName', {
                    initialValue: store.storeName,
                    rules: [{ required: true, message: '请输入店铺名称' }],
                  })(
                    <Input placeholder="请输入店铺名称" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label='店铺电话'>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: store.phoneNumber,
                    rules: [{ required: true, message: '请输入店铺电话' }],
                  })(
                    <Input placeholder="请输入店铺电话" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label='详细地址'>
                  {getFieldDecorator('address', {
                    initialValue: store.address,
                    rules: [{ required: true, message: '请输入店铺详细地址' }],
                  })(
                    <TextArea placeholder="请输入店铺详细地址" autosize/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label='开始营业时间'>
                  {getFieldDecorator('startTime', {
                    initialValue: moment(store.startTime, 'HHmm'),
                    rules: [{ required: true, message: '请选择开始营业时间' }],
                  })(
                    <TimePicker format={timeFormat} minuteStep={30} />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label='结束营业时间'>
                  {getFieldDecorator('endTime', {
                    initialValue: moment(store.endTime, 'HHmm'),
                    rules: [{ required: true, message: '请选择结束营业时间' }],
                  })(
                    <TimePicker format={timeFormat} minuteStep={30} />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label='单位时间长度'>
                  {getFieldDecorator('unitDuration', {
                    initialValue: store.unitDuration,
                    rules: [{ required: true, message: '请输入单位时间长度，以分钟为最小单位，如10分钟，则输入10' }],
                  })(
                    <Input placeholder="请输入单位时间长度，以分钟为最小单位，如10分钟，则输入10" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label='单位时间内最大预约次数'>
                  {getFieldDecorator('unitTimes', {
                    initialValue: store.unitTimes,
                    rules: [{ required: true, message: '请输入单位时间允许的最大预约次数' }],
                  })(
                    <Input placeholder="请输入单位时间允许的最大预约次数" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label='经度'>
                  {getFieldDecorator('longitude', {
                    initialValue: store.longitude,
                    rules: [{ required: true, message: '请输入店铺经度，可使用百度地图定位到详细经、纬度' }],
                  })(
                    <Input placeholder="经度" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={4} md={12} sm={24}>
                <Form.Item label='纬度'>
                  {getFieldDecorator('latitude', {
                    initialValue: store.latitude,
                    rules: [{ required: true, message: '请输入店铺纬度，可使用百度地图定位到详细经、纬度' }],
                  })(
                    <Input placeholder="纬度" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label='交通信息'>
                  {getFieldDecorator('traffic', {
                    initialValue: store.traffic,
                    rules: [{ required: true, message: '请输入店铺的交通信息' }],
                  })(
                    <TextArea placeholder="请输入店铺的交通信息" autosize/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="选择产品" className={styles.card} bordered={false} loading={productsLoading}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                {/* <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllProductChange}
                  checked={this.state.checkAll}>
                  全选
                </Checkbox> */}
                <Form.Item>
                  {getFieldDecorator('products', {
                    // initialValue: this.state.checkedList,
                    initialValue: store.products || [],
                    rules: [{ required: true, message: '请选择产品' }],
                  })(
                    <CheckboxGroup options={productOptions} onChange={this.onProductChange} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="添加设备" className={styles.card} bordered={false}>
          {getFieldDecorator('devices', {
            initialValue: store.devices || [],
          })(<DeviceTableForm selectOptions={deviceProductOptions}/>)}
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

// export default connect(state => ({
//   collapsed: state.global.collapsed,
//   store: state.store,
// }))(Form.create()(StoreForm));
