import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Form, Input, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';


const Popup = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  const [notionAuth, setNotionAuth] = useState("");
  const [notionDatabaseIdMJ, setNotionDatabaseIdMJ] = useState("");
  const [notionDatabaseIdSD, setNotionDatabaseIdSD] = useState("");

  useEffect(() => {
    console.log("storage");

    // Load saved settings when the popup opens
    chrome.storage.local.get(["notionAuth", "notionDatabaseIdMJ", "notionDatabaseIdSD"], (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      // 更新表单的初始值
      setInitialValues({
        notionAuth: result.notionAuth || "",
        notionDatabaseIdMJ: result.notionDatabaseIdMJ || "",
        notionDatabaseIdSD: result.notionDatabaseIdSD || "",
      });
      // 使用 form.setFieldsValue 更新表单的值
      form.setFieldsValue({
        notionAuth: result.notionAuth || "",
        notionDatabaseIdMJ: result.notionDatabaseIdMJ || "",
        notionDatabaseIdSD: result.notionDatabaseIdSD || "",
      });
    });
  }, []);

  const saveSettings = (values: any) => {
    console.log("values", values);

    // Save the settings to chrome.storage.local
    chrome.storage.local.set(values);
  };

  return (
    <Form
      layout="horizontal"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={initialValues}
      onFinish={saveSettings}
    >
      <Form.Item
        label="Notion 授权码"
        name="notionAuth"
        rules={[{ required: false, message: '请输入 Notion 授权码' }]}
      >
        <Input.Password
          placeholder="Enter Notion Auth"
          value={notionAuth}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <Form.Item
        label="Notion DatabaseID (MJ)"
        name="notionDatabaseIdMJ"
        rules={[{ required: false, message: '请输入 Notion DatabaseID (MJ)' }]}
      >
        <Input.Password
          placeholder="Enter Notion DatabaseID (MJ)"
          value={notionDatabaseIdMJ}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <Form.Item
        label="Notion DatabaseID (SD)"
        name="notionDatabaseIdSD"
        rules={[{ required: false, message: '请输入 Notion DatabaseID (SD)' }]}
      >
        <Input.Password
          placeholder="Enter Notion DatabaseID (SD)"
          value={notionDatabaseIdSD}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
        <Button type="primary" htmlType="submit" block>
          保存设置
        </Button>
      </Form.Item>
    </Form>


  );
};

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
