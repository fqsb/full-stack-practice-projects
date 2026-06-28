import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ConfirmDialog = ({ title, content, onConfirm, confirmLoading, visible, onCancel }) => {
  return (
    <Modal
      title={<><ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />{title}</>}
      open={visible}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={onConfirm}>确认</Button>
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmDialog;