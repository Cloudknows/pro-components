import { FontSizeOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormCaptcha,
  ProFormColorPicker,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormDigitRange,
  ProFormField,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import '@testing-library/jest-dom';
import { render as reactRender } from '@testing-library/react';
import { Button, ConfigProvider, Input } from 'antd';
import { mount } from 'enzyme';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint, waitTime } from '../util';

describe('ProForm', () => {
  it('π¦ submit props actionsRender=false', async () => {
    const wrapper = mount(<ProForm submitter={false} />);
    await waitForComponentToPaint(wrapper);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('π¦ componentSize is work', async () => {
    const wrapper = mount(
      <ConfigProvider componentSize="small">
        <ProForm>
          <ProFormText />
        </ProForm>
      </ConfigProvider>,
    );
    expect(wrapper.find('.ant-input-sm').length).toBe(1);
  });

  it('π¦ ProForm support sync form url', async () => {
    const fn = jest.fn();
    const wrapper = mount<{ navTheme: string }>(
      <ProForm
        onFinish={async (values) => {
          fn(values.navTheme);
        }}
        syncToUrl
      >
        <ProFormText
          tooltip={{
            title: 'δΈ»ι’',
            icon: <FontSizeOutlined />,
          }}
          name="navTheme"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toHaveBeenCalledWith('realDark');

    act(() => {
      wrapper.find('button.ant-btn').at(1).simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toHaveBeenCalledWith('realDark');
  });

  it('π¦ ProForm support sync form url as important', async () => {
    const fn = jest.fn();
    const wrapper = mount<{ navTheme: string }>(
      <ProForm
        onFinish={async (values) => {
          fn(values.navTheme);
        }}
        syncToUrl
        syncToUrlAsImportant
      >
        <ProFormText
          tooltip={{
            title: 'δΈ»ι’',
            icon: <FontSizeOutlined />,
          }}
          name="navTheme"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toHaveBeenCalledWith('realDark');

    act(() => {
      wrapper.find('button.ant-btn').at(1).simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toHaveBeenCalledWith('realDark');
  });

  it('π¦ ProForm support sync form url and rest', async () => {
    const onFinish = jest.fn();
    const wrapper = mount<{ navTheme: string }>(
      <ProForm
        onFinish={async (values) => {
          onFinish(values.navTheme);
        }}
        syncToUrl
        syncToInitialValues={false}
      >
        <ProFormText name="navTheme" />
        <ProForm.Item>
          {() => {
            return '123';
          }}
        </ProForm.Item>
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onFinish).toHaveBeenCalledWith('realDark');

    // rest
    act(() => {
      wrapper.find('button.ant-btn').at(1).simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(onFinish).toHaveBeenCalledWith(undefined);
  });

  it('π¦ ProForm initialValues update will warning', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          fn(values.navTheme);
        }}
        initialValues={{}}
      >
        <ProFormText name="navTheme" />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toHaveBeenCalledWith(undefined);

    act(() => {
      wrapper.setProps({
        initialValues: {
          navTheme: 'xxx',
        },
      });
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toHaveBeenCalledWith(undefined);
  });

  it('π¦ onFinish should simulate button loading', async () => {
    const fn = jest.fn();
    const wrapper = reactRender(
      <ProForm
        onFinish={async () => {
          fn();
          await waitTime(2000);
        }}
      />,
    );

    await waitForComponentToPaint(wrapper, 200);
    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    await waitForComponentToPaint(wrapper, 200);
    const dom = await (await wrapper.findByText('ζ δΊ€')).parentElement;
    expect(dom?.className.includes('ant-btn-loading')).toBe(true);
    expect(fn).toBeCalled();
  });

  it('π¦ onFinish should simulate button close loading', async () => {
    const fn = jest.fn();
    const wrapper = reactRender(
      <ProForm
        onFinish={async () => {
          fn();
          await waitTime(1000);
          throw new Error('ζθ΄€');
        }}
      />,
    );

    await waitForComponentToPaint(wrapper, 200);
    await act(async () => {
      await (await wrapper.findByText('ζ δΊ€')).click();
    });
    await waitForComponentToPaint(wrapper, 200);
    let dom = await (await wrapper.findByText('ζ δΊ€')).parentElement;
    expect(dom?.className.includes('ant-btn-loading')).toBe(true);
    expect(fn).toBeCalled();

    await waitForComponentToPaint(wrapper, 1000);

    dom = await (await wrapper.findByText('ζ δΊ€')).parentElement;
    expect(dom?.className.includes('ant-btn-loading')).toBe(false);
  });

  it('π¦ onFinish support params and request', async () => {
    const wrapper = reactRender(
      <ProForm
        request={async (params) => {
          await waitTime(100);
          return params;
        }}
        params={{
          name: 'test',
        }}
      >
        <ProFormText name="name" />
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper, 200);

    expect(!!wrapper.findAllByDisplayValue('test')).toBeTruthy();

    act(() => {
      wrapper.rerender(
        <ProForm
          key="rerender"
          request={async (params) => {
            await waitTime(100);
            return params;
          }}
          params={{
            name: '1234',
          }}
        >
          <ProFormText name="name" />
        </ProForm>,
      );
    });
    await waitForComponentToPaint(wrapper, 500);

    expect(!!wrapper.findAllByDisplayValue('1234')).toBeTruthy();
  });

  it('π¦ submit props actionsRender=()=>false', async () => {
    const wrapper = mount(
      <ProForm
        submitter={{
          render: () => false,
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('π¦ submit props actionsRender is one', async () => {
    const wrapper = mount(
      <ProForm
        submitter={{
          render: () => [<a key="test">test</a>],
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('π¦ support formRef', async () => {
    const formRef = React.createRef<ProFormInstance<any>>();
    const wrapper = mount(
      <ProForm
        formRef={formRef}
        submitter={{
          render: () => [<a key="test">test</a>],
        }}
        initialValues={{
          test: '12,34',
        }}
      >
        <ProFormText
          name="test"
          transform={(value) => {
            return {
              test: value.split(','),
            };
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper, 1000);
    expect(formRef.current?.getFieldFormatValue?.('test')?.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldFormatValueObject?.('test')?.test.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldFormatValueObject?.()?.test.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldsFormatValue?.()?.test.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldFormatValue?.(['test'])?.join('-')).toBe('12-34');
    expect(formRef.current?.getFieldValue?.('test')).toBe('12,34');
  });

  it('π¦ ProForm support namePath is array', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm
        initialValues={{
          name: {
            test: 'test',
          },
          test: 'test2',
        }}
        isKeyPressSubmit
        onFinish={async (params) => {
          fn(params);
        }}
      >
        <ProFormText name={['name', 'test']} />
        <ProFormText name="test" />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('keypress', {
        key: 'Enter',
      });
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalledWith({
      name: {
        test: 'test',
      },
      test: 'test2',
    });
  });

  it('π¦ ProForm support enter submit', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm
        omitNil={false}
        isKeyPressSubmit
        onFinish={async () => {
          fn();
        }}
      >
        <ProFormText name="test" />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('keypress', {
        key: 'Enter',
      });
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalled();
  });

  it('π¦ submit props actionsRender=false', async () => {
    const wrapper = mount(
      <ProForm
        submitter={{
          render: false,
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('π¦ submit props actionsRender=()=>[]', async () => {
    const wrapper = mount(
      <ProForm
        submitter={{
          render: () => [],
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('π¦ submit props render=()=>[]', async () => {
    const wrapper = mount(
      <ProForm
        submitter={{
          render: () => [
            <Button key="submit" type="primary">
              ζδΊ€εΉΆεεΈ
            </Button>,
          ],
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('π¦ submitter props support submitButtonProps', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm
        submitter={{
          submitButtonProps: {
            className: 'test_button',
            onClick: () => {
              fn();
            },
          },
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });

    act(() => {
      wrapper.find('button.test_button').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalled();
  });

  it('π¦ submitter props support resetButtonProps', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm
        submitter={{
          resetButtonProps: {
            className: 'test_button',
            onClick: () => {
              fn();
            },
          },
        }}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
    act(() => {
      wrapper.find('button.test_button').simulate('click');
    });
    expect(fn).toBeCalled();
  });

  it('π¦ submitter.render simulate onFinish', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={onFinish}
        submitter={{
          render: ({ form }) => [
            <Button
              id="submit"
              key="submit"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              ζδΊ€εΉΆεεΈ
            </Button>,
          ],
        }}
      >
        <ProFormText label="name" name="name" />
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('button#submit').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 100);

    expect(onFinish).toBeCalled();
  });

  it('π¦ ProFormCaptcha support onGetCaptcha', async () => {
    const wrapper = mount(
      <ProForm>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
          }}
          captchaProps={{
            id: 'test',
          }}
          countDown={2}
          label="name"
          name="name"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('Button#test').text()).toBe('θ·ειͺθ―η ');
    act(() => {
      wrapper.find('Button#test').simulate('click');
    });
    await waitForComponentToPaint(wrapper, 100);

    expect(wrapper.find('button#test').text()).toBe('2 η§ειζ°θ·ε');
    await waitForComponentToPaint(wrapper, 1200);

    expect(wrapper.find('button#test').text()).toBe('1 η§ειζ°θ·ε');

    await waitForComponentToPaint(wrapper, 2000);
    expect(wrapper.find('Button#test').text()).toBe('θ·ειͺθ―η ');
  });

  it('π¦ ProFormCaptcha support value and onchange', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm onFinish={(values) => onFinish(values.name)}>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
          }}
          countDown={2}
          label="name"
          name="name"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('input#name').simulate('change', {
        target: {
          value: 'test',
        },
      });
    });

    await waitForComponentToPaint(wrapper, 100);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(wrapper, 100);

    expect(onFinish).toBeCalledWith('test');
  });

  it('π¦ ProFormCaptcha support captchaTextRender', async () => {
    const wrapper = mount(
      <ProForm>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
          }}
          captchaTextRender={(timing) => (timing ? 'ιζ°θ·ε' : 'θ·ε')}
          captchaProps={{
            id: 'test',
          }}
          label="name"
          name="name"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('Button#test').text()).toBe('θ· ε');
    act(() => {
      wrapper.find('Button#test').simulate('click');
    });
    await waitForComponentToPaint(wrapper, 100);
    expect(wrapper.find('button#test').text()).toBe('ιζ°θ·ε');
  });

  it('π¦ ProFormCaptcha onGetCaptcha throw error', async () => {
    const wrapper = mount(
      <ProForm>
        <ProFormCaptcha
          onGetCaptcha={async () => {
            await waitTime(10);
            throw new Error('TEST');
          }}
          captchaTextRender={(timing) => (timing ? 'ιζ°θ·ε' : 'θ·ε')}
          captchaProps={{
            id: 'test',
          }}
          label="name"
          name="name"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('Button#test').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('button#test').text()).toBe('θ· ε');
  });

  it('π¦ ProFormCaptcha onGetCaptcha support rules', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormText
          name="phone"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormCaptcha
          onGetCaptcha={async () => {
            fn();
            await waitTime(10);
          }}
          phoneName="phone"
          captchaProps={{
            id: 'test',
          }}
          label="name"
          name="name"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      wrapper.find('Button#test').simulate('click');
    });

    expect(fn).not.toBeCalled();
    act(() => {
      wrapper
        .find('input')
        .at(1)
        .simulate('change', {
          target: {
            value: 'tech',
          },
        });
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('Button#test').simulate('click');
    });
    await waitForComponentToPaint(wrapper);
    expect(fn).toBeCalled();
  });

  it('π¦ ProFormDependency', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={onFinish}
        initialValues={{
          name: 'θθθ?Ύθ?‘ζιε¬εΈ',
          name2: 'θθθ?Ύθ?‘ιε’',
          useMode: 'chapter',
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="η­ΎηΊ¦ε?’ζ·εη§°"
          tooltip="ζιΏδΈΊ 24 δ½"
          placeholder="θ―·θΎε₯εη§°"
        />
        <ProFormText
          width="md"
          name={['name2', 'text']}
          label="η­ΎηΊ¦ε?’ζ·εη§°"
          tooltip="ζιΏδΈΊ 24 δ½"
          placeholder="θ―·θΎε₯εη§°"
        />
        {/*  ProFormDependency δΌθͺε¨ζ³¨ε₯εΉΆδΈ θΏθ‘ shouldUpdate ηζ―ε―Ή  */}
        <ProFormDependency name={['name', ['name2', 'text']]}>
          {(values) => {
            return (
              <ProFormSelect
                options={[
                  {
                    value: 'chapter',
                    label: 'ηη« εηζ',
                  },
                ]}
                width="md"
                name="useMode"
                label={
                  <span id="label_text">{`δΈγ${values?.name || ''}γ δΈ γ${
                    values?.name2?.text || ''
                  }γεεηΊ¦ε?ηζζΉεΌ`}</span>
                }
              />
            );
          }}
        </ProFormDependency>
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('input#name').simulate('change', {
        target: {
          value: 'test',
        },
      });
    });

    act(() => {
      wrapper.find('input#name2_text').simulate('change', {
        target: {
          value: 'test2',
        },
      });
    });

    expect(wrapper.find('span#label_text').text()).toBe('δΈγtestγ δΈ γtest2γεεηΊ¦ε?ηζζΉεΌ');
  });

  it('π¦ ProForm.Group support collapsible', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProForm.Group title="qixian" collapsible onCollapse={(c) => fn(c)}>
          <ProFormText name="phone" />
          <ProFormText name="phone2" />
        </ProForm.Group>
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-pro-form-group-title').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(true);

    act(() => {
      wrapper.find('.ant-pro-form-group-title').simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(false);
  });

  it('π¦ ProForm.Group support defaultCollapsed', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProForm.Group title="qixian" collapsible defaultCollapsed={true} onCollapse={(c) => fn(c)}>
          <ProFormText name="phone" />
          <ProFormText name="phone2" />
        </ProForm.Group>
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-pro-form-group-title').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(false);

    act(() => {
      wrapper.find('.ant-pro-form-group-title').simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(fn).toBeCalledWith(true);
  });

  it('π¦ ProForm.Group support defaultCollapsed', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProForm.Group
          title="qixian"
          collapsible
          extra={<a id="click">ηΉε»</a>}
          onCollapse={(c) => fn(c)}
        >
          <ProFormText name="phone" />
          <ProFormText name="phone2" />
        </ProForm.Group>
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('#click').simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    expect(fn).not.toBeCalled();
  });
  it('π¦ ProForm.Group support FormItem hidden', async () => {
    const wrapper = mount(
      <ProForm>
        <ProForm.Group title="qixian" collapsible>
          <ProFormText name="mobile" hidden />
          <div>mobile</div>
          <ProFormText name="mobile2" />
        </ProForm.Group>
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-pro-form-group-container div.ant-form-item').length).toBe(1);
    expect(wrapper.find('.ant-pro-form-group-container div.ant-space-item').length).toBe(2);
  });

  it('π¦ ProFormField support onChange', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <ProForm onValuesChange={fn}>
        <ProFormField name="phone2">
          <Input id="testInput" />
        </ProFormField>
      </ProForm>,
    );

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('input#testInput').simulate('change', {
        target: {
          value: 'test',
        },
      });
    });
    expect(fn).toBeCalled();
  });

  it('π¦ DatePicker', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={onFinish}
        initialValues={{
          date: '2020-09-10',
          dateWeek: '2020-37th',
          dateMonth: '2020-09',
          dateQuarter: '2020-Q2',
        }}
      >
        <ProFormDatePicker name="date" label="ζ₯ζ" fieldProps={{ open: true }} />
        <ProFormDatePicker.Week name="dateWeek" label="ε¨" />
        <ProFormDatePicker.Month name="dateMonth" label="ζ" />
        <ProFormDatePicker.Quarter name="dateQuarter" label="ε­£εΊ¦" />
        <ProFormDatePicker.Year name="dateYear" label="εΉ΄" />
      </ProForm>,
    );
    act(() => {
      wrapper.find('.ant-picker-cell').at(2).simulate('click');
    });
    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });
    await waitForComponentToPaint(wrapper);
    expect(onFinish).toHaveBeenCalledWith({
      date: '2020-09-02',
      dateWeek: '2020-37th',
      dateMonth: '2020-09',
      dateQuarter: '2020-Q2',
    });
  });

  it('π¦ SearchSelect onSearch support', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            onSearch: (e) => onSearch(e),
          }}
          options={[
            { label: 'ε¨ι¨', value: 'all' },
            { label: 'ζͺθ§£ε³', value: 'open' },
            { label: 'ε·²θ§£ε³', value: 'closed' },
            { label: 'θ§£ε³δΈ­', value: 'processing' },
          ]}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');
  });

  it('π¦ SearchSelect onSearch support valueEnum', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');
  });

  it('π¦ SearchSelect onSearch support valueEnum clear', async () => {
    const onSearch = jest.fn();
    const onValuesChange = jest.fn();
    const wrapper = mount(
      <ProForm
        onValuesChange={async (values) => {
          //  {"disabled": undefined, "key": "all", "label": "ε¨ι¨", "value": "all"}
          onValuesChange(values.userQuery[0].label);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');

    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(onValuesChange).toBeCalledWith('ε¨ι¨');
  });

  it('π¦ SearchSelect onSearch support valueEnum clear item filter', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-select-item').length).toBe(1);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('focus');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('.ant-select-item').length).toBe(4);
  });

  it('π¦ SearchSelect support onClear', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm onValuesChange={(e) => console.log(e)}>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          showSearch
          fieldProps={{
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-select-item').length).toBe(1);

    act(() => {
      wrapper.find('.ant-select-item-option-content div span').simulate('click');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select').simulate('mouseenter');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('span.ant-select-clear').last().simulate('mousedown');
    });

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('.ant-select-item').length).toBe(4);
  });

  it('π¦ SearchSelect support searchOnFocus', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-select-item').length).toBe(1);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('focus');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('.ant-select-item').length).toBe(4);
  });

  it('π¦ SearchSelect support resetAfterSelect', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            resetAfterSelect: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onSearch).toBeCalledWith('ε¨');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    expect(wrapper.find('.ant-select-item').length).toBe(1);
    expect(wrapper.find('.ant-select-item-option-content div span').text()).toBe('ε¨');

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('.ant-select-item').length).toBe(4);
  });

  it('π¦ SearchSelect support fetchDataOnSearch: false', async () => {
    const onRequest = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            fetchDataOnSearch: false,
          }}
          request={async () => {
            onRequest();
            return [
              { label: 'ε¨ι¨', value: 'all' },
              { label: 'ζͺθ§£ε³', value: 'open' },
              { label: 'ε·²θ§£ε³', value: 'closed' },
              { label: 'θ§£ε³δΈ­', value: 'processing' },
            ];
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    expect(onRequest.mock.calls.length).toBe(1);
  });

  it('π¦ SearchSelect support fetchDataOnSearch: true', async () => {
    const onRequest = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            fetchDataOnSearch: true,
          }}
          request={async () => {
            onRequest();
            return [
              { label: 'ε¨ι¨', value: 'all' },
              { label: 'ζͺθ§£ε³', value: 'open' },
              { label: 'ε·²θ§£ε³', value: 'closed' },
              { label: 'θ§£ε³δΈ­', value: 'processing' },
            ];
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ε¨',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    expect(onRequest.mock.calls.length).toBe(2);
  });

  it('π¦ SearchSelect support multiple', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            mode: 'multiple',
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    // ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(1).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    await waitForComponentToPaint(wrapper);

    expect(onFinish).toBeCalledWith(2);
  });

  it('π¦ SearchSelect filter support optionGroup', async () => {
    const onValuesChange = jest.fn();
    const wrapper = mount(
      <ProForm
        onValuesChange={async (values) => {
          onValuesChange(values?.userQuery[0].value);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="δΈε‘ηΊΏ"
          rules={[{ required: true }]}
          options={[
            {
              label: 'Aη³»η»',
              value: 'Aη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'ι¨εΊε°η¨εΊ', value: 'ι¨εΊε°η¨εΊ' },
                { label: 'θ΅ιηΊΏ', value: 'θ΅ιηΊΏ' },
              ],
            },
            {
              label: 'Bη³»η»',
              value: 'Bη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'Bι¨εΊε°η¨εΊ', value: 'Bι¨εΊε°η¨εΊ' },
                { label: 'Bθ΅ιηΊΏ', value: 'Bθ΅ιηΊΏ' },
              ],
            },
          ]}
          showSearch
          fieldProps={{
            allowClear: false,
            showSearch: true,
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'ι¨',
        },
      });
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').at(0).text()).toBe('ι¨');

    // εΊθ―₯ζδΈ€δΈͺ item θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(2);

    act(() => {
      wrapper.find('.ant-select-item.ant-select-item-option').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(onValuesChange).toBeCalledWith('ι¨εΊε°η¨εΊ');

    // εΊθ―₯ζδΈ€δΈͺ item θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(4);
  });

  it('π¦ SearchSelect filter support (', async () => {
    const onValuesChange = jest.fn();
    const wrapper = mount(
      <ProForm
        onValuesChange={async (values) => {
          onValuesChange(values?.userQuery[0].value);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="δΈε‘ηΊΏ"
          rules={[{ required: true }]}
          options={[
            {
              label: 'Aη³»η»',
              value: 'Aη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'ι¨εΊε°η¨εΊ(ζ΅θ―)', value: 'ι¨εΊε°η¨εΊ' },
                { label: 'θ΅ιηΊΏ', value: 'θ΅ιηΊΏ' },
              ],
            },
            {
              label: 'Bη³»η»',
              value: 'Bη³»η»',
              optionType: 'optGroup',
              children: [
                { label: 'Bι¨εΊε°η¨εΊ', value: 'Bι¨εΊε°η¨εΊ' },
                { label: 'Bθ΅ιηΊΏ', value: 'Bθ΅ιηΊΏ' },
              ],
            },
          ]}
          showSearch
          fieldProps={{
            allowClear: false,
            showSearch: true,
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: '(ζ΅θ―)',
        },
      });
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    expect(wrapper.find('.ant-select-item-option-content div span').at(0).text()).toBe('(ζ΅θ―)');

    // εΊθ―₯ζδΈ€δΈͺ item θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(1);

    act(() => {
      wrapper.find('.ant-select-item.ant-select-item-option').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    expect(onValuesChange).toBeCalledWith('ι¨εΊε°η¨εΊ');

    // εΊθ―₯ζδΈ€δΈͺ item θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(4);
  });

  it('π¦ SearchSelect support multiple and autoClearSearchValue: false ', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();

    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect.SearchSelect
          name="userQuery"
          label="δΊ§ειζ©"
          placeholder="ζ΅θ― placeholder"
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: false,
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            { label: 'ε¨ι¨', value: 'all' },
            { label: 'ζͺθ§£ε³', value: 'open' },
            { label: 'ε·²θ§£ε³', value: 'closed' },
            { label: 'θ§£ε³δΈ­', value: 'processing' },
          ]}
        />
      </ProForm>,
    );

    // ηΉε»ζη΄’ζ‘
    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    // ι»θ?€ε±η€Ίζζη7δΈͺιι‘Ή
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(4);
    // ι»θ?€θΎε₯ζ‘ζ²‘ζεε?Ή
    expect(wrapper.find('.ant-select-item-option-content div span').length).toBe(0);
    // input εη΄ ηεε?ΉδΉδΈΊη©Ί
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('');

    // θΎε₯ζη΄’εε?Ή
    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'θ§£',
        },
      });
    });

    await waitForComponentToPaint(wrapper);

    // εΊθ―₯ζ4δΈͺitem θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(3);
    // input δΉζθΎε₯ηεε?Ή
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('θ§£');

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(wrapper.find('.ant-select-item-option-content').at(0).text()).toBe('ζͺθ§£ε³');
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('θ§£');
    // ζη΄’ηη»ζ, εΊθ―₯δΏζδΈε
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(3);

    // η»§η»­ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(1).simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(wrapper.find('.ant-select-item-option-content').at(1).text()).toBe('ε·²θ§£ε³');
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('θ§£');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    await waitForComponentToPaint(wrapper);

    expect(onFinish).toBeCalledWith(2);
  });

  it('π¦ Select support single', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery);
        }}
      >
        <ProFormSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    // ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(1).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    await waitForComponentToPaint(wrapper);

    expect(onFinish).toBeCalledWith('open');
  });

  it('π¦ ProFormSelect support filterOption', async () => {
    const onSearch = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect
          fieldProps={{
            filterOption: false,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            { value: 1, label: 'Aa' },
            { value: 2, label: 'Bb' },
            { value: 3, label: 'Cc' },
          ]}
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'A',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    expect(wrapper.find('.ant-select-item').length).toBe(3);

    await waitForComponentToPaint(wrapper);
  });

  it('π¦ Select filterOption support mixed case', async () => {
    const wrapper = mount(
      <ProForm>
        <ProFormSelect
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          fieldProps={{
            showSearch: true,
            options: [
              { value: 1, label: 'Aa' },
              { value: 2, label: 'Bb' },
              { value: 3, label: 'Cc' },
            ],
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'b',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    expect(wrapper.find('.ant-select-item').length).toBe(1);

    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: 'B',
        },
      });
    });
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    expect(wrapper.find('.ant-select-item').length).toBe(1);

    await waitForComponentToPaint(wrapper);
  });

  it('π¦ Select support labelInValue single', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery.value);
        }}
      >
        <ProFormSelect
          fieldProps={{
            labelInValue: true,
          }}
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    // ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(1).simulate('click');
    });

    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    await waitForComponentToPaint(wrapper);

    expect(onFinish).toBeCalledWith('open');
  });

  it('π¦ Select support multiple unnamed async options', async () => {
    const wrapper = mount(
      <>
        <ProFormSelect id="select1" request={async () => [{ value: 1 }]} />
        <ProFormSelect id="select2" request={async () => [{ value: 2 }]} />
      </>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').at(0).simulate('mousedown');
      wrapper.find('.ant-select-selector').at(1).simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('#select1 .ant-select-item').at(0).text()).toBe('1');
    expect(wrapper.find('#select2 .ant-select-item').at(0).text()).toBe('2');
  });

  it('π¦ Select support multiple and autoClearSearchValue: false ', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();

    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect
          name="userQuery"
          label="δΊ§ειζ©"
          placeholder="ζ΅θ― placeholder"
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: false,
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            {
              value: '2',
              label: 'η½ηΉ2',
            },
            {
              value: '21',
              label: 'η½ηΉ21',
            },
            {
              value: '22',
              label: 'η½ηΉ22',
            },
            {
              value: '3',
              label: 'η½ηΉ3',
            },
            {
              value: '31',
              label: 'η½ηΉ31',
            },
            {
              value: '32',
              label: 'η½ηΉ32',
            },
            {
              value: '33',
              label: 'η½ηΉ33',
            },
          ]}
        />
      </ProForm>,
    );

    // ηΉε»ζη΄’ζ‘
    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    // ι»θ?€ε±η€Ίζζη7δΈͺιι‘Ή
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(7);
    // ι»θ?€θΎε₯ζ‘ζ²‘ζεε?Ή
    expect(wrapper.find('.ant-select-item-option-content div span').length).toBe(0);
    // input εη΄ ηεε?ΉδΉδΈΊη©Ί
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('');

    // θΎε₯ζη΄’εε?Ή
    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: '2',
        },
      });
    });

    await waitForComponentToPaint(wrapper);

    // εΊθ―₯ζ4δΈͺitem θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(4);
    // input δΉζθΎε₯ηεε?Ή
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('2');

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(wrapper.find('.ant-select-item-option-content').at(0).text()).toBe('η½ηΉ2');
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('2');
    // ζη΄’ηη»ζ, εΊθ―₯δΏζδΈε
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(4);

    // η»§η»­ιδΈ­η¬¬δΊδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(1).simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(wrapper.find('.ant-select-item-option-content').at(1).text()).toBe('η½ηΉ21');
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('2');

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    await waitForComponentToPaint(wrapper);

    expect(onFinish).toBeCalledWith(2);
  });

  it('π¦ Select support multiple and autoClearSearchValue: true', async () => {
    const onSearch = jest.fn();
    const onFinish = jest.fn();

    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.userQuery?.length);
        }}
      >
        <ProFormSelect
          name="userQuery"
          label="δΊ§ειζ©"
          placeholder="ζ΅θ― placeholder"
          fieldProps={{
            mode: 'multiple',
            autoClearSearchValue: true,
            searchOnFocus: true,
            onSearch: (e) => onSearch(e),
          }}
          options={[
            {
              value: '2',
              label: 'η½ηΉ2',
            },
            {
              value: '21',
              label: 'η½ηΉ21',
            },
            {
              value: '22',
              label: 'η½ηΉ22',
            },
            {
              value: '3',
              label: 'η½ηΉ3',
            },
            {
              value: '31',
              label: 'η½ηΉ31',
            },
            {
              value: '32',
              label: 'η½ηΉ32',
            },
            {
              value: '33',
              label: 'η½ηΉ33',
            },
          ]}
        />
      </ProForm>,
    );

    // ηΉε»ζη΄’ζ‘
    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    // ι»θ?€ε±η€Ίζζη7δΈͺιι‘Ή
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(7);
    // ι»θ?€θΎε₯ζ‘ζ²‘ζεε?Ή
    expect(wrapper.find('.ant-select-item-option-content div span').length).toBe(0);
    // input εη΄ ηεε?ΉδΉδΈΊη©Ί
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('');

    // θΎε₯ζη΄’εε?Ή
    act(() => {
      wrapper.find('.ant-select-selection-search-input').simulate('change', {
        target: {
          value: '2',
        },
      });
    });

    await waitForComponentToPaint(wrapper);

    // εΊθ―₯ζ4δΈͺitem θ’«η­ιεΊζ₯
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(4);
    // input δΉζθΎε₯ηεε?Ή
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('2');

    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
    });
    await waitForComponentToPaint(wrapper);

    // ιδΈ­ηεε?ΉεΊη°ε¨ input δΈ­
    expect(wrapper.find('.ant-select-item-option-content').at(0).text()).toBe('η½ηΉ2');
    // ιδΈ­εοΌ δΌθͺε¨ζΈη©Ίζη΄’εε?Ή
    expect(wrapper.find('input.ant-select-selection-search-input').props().value).toBe('');
    // ζη΄’ηη»ζ, ζ’ε€ε°εε§η»ζ
    expect(wrapper.find('div.ant-select-item.ant-select-item-option').length).toBe(7);

    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    // ε€ζ¬‘ζδΊ€ιθ¦ι»ζ­’
    act(() => {
      wrapper.find('.ant-btn-primary').simulate('submit');
    });

    await waitForComponentToPaint(wrapper);

    expect(onFinish).toBeCalledWith(1);
  });

  it('π¦ ColorPicker support rgba', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onValuesChange={async (values) => {
          onFinish(values?.color);
        }}
      >
        <ProFormColorPicker name="color" label="ι’θ²ιζ©" />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-pro-field-color-picker').simulate('click');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.flexbox-fix').at(2).find('div span div').at(2).simulate('click');
    });
    await waitForComponentToPaint(wrapper, 100);

    expect(onFinish).toBeCalledWith('#5b8ff9');

    act(() => {
      wrapper.find('#rc-editable-input-5').simulate('change', {
        target: {
          value: 2,
        },
      });
    });
    await waitForComponentToPaint(wrapper, 100);
    expect(onFinish).toBeCalledWith('rgba(91, 143, 249, 0.02)');
  });

  it('π¦ validateFieldsReturnFormatValue', async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const App = () => {
      const formRef = useRef<
        ProFormInstance<{
          date: string;
        }>
      >();

      useEffect(() => {
        formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
          fn1(val.date);
        });
      }, []);

      return (
        <ProForm
          onValuesChange={async () => {
            formRef.current?.validateFieldsReturnFormatValue?.().then((val) => {
              fn2(val.date);
            });
          }}
          formRef={formRef}
        >
          <ProFormDatePicker
            name="date"
            initialValue={moment('2021-08-09')}
            fieldProps={{ open: true }}
          />
        </ProForm>
      );
    };

    const wrapper = mount(<App />);
    await waitForComponentToPaint(wrapper);

    expect(fn1).toHaveBeenCalledWith('2021-08-09');

    act(() => {
      wrapper.find('.ant-picker-cell').at(2).simulate('click');
    });
    await waitForComponentToPaint(wrapper, 100);
    expect(fn2).toHaveBeenCalledWith('2021-07-28');
    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('π¦ DigitRange Will return undefined when both value equal to undefined', async () => {
    const onFinish = jest.fn();
    const wrapper = mount(
      <ProForm
        onFinish={async (values) => {
          onFinish(values?.digitRange);
        }}
      >
        <ProFormDigitRange name="digitRange" />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    // ζ΅θ―εΊζ¬εθ½
    act(() => {
      wrapper
        .find('.ant-input-number-input')
        .at(0)
        .simulate('change', {
          target: {
            value: '1',
          },
        });
    });

    await waitForComponentToPaint(wrapper, 100);

    act(() => {
      wrapper
        .find('.ant-input-number-input')
        .at(1)
        .simulate('change', {
          target: {
            value: '2',
          },
        });
    });

    await waitForComponentToPaint(wrapper, 100);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 100);

    expect(onFinish).toBeCalledWith([1, 2]);

    // ζ΅θ―ζΈη©ΊδΈ€δΈͺεΌ
    act(() => {
      wrapper
        .find('.ant-input-number-input')
        .at(0)
        .simulate('change', {
          target: {
            value: '',
          },
        });
    });

    await waitForComponentToPaint(wrapper, 100);

    act(() => {
      wrapper
        .find('.ant-input-number-input')
        .at(1)
        .simulate('change', {
          target: {
            value: '',
          },
        });
    });

    await waitForComponentToPaint(wrapper, 100);

    act(() => {
      wrapper.find('.ant-input-number-input').at(1).simulate('blur');
    });

    await waitForComponentToPaint(wrapper, 100);

    act(() => {
      wrapper.find('button.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(wrapper, 100);

    expect(onFinish).toBeCalledWith(undefined);
  });

  it('π¦ when dateFormatter is a Function', async () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();
    const App = () => {
      return (
        <ProForm
          dateFormatter={(value, valueType) => {
            fn1(value.format('YYYY/MM/DD HH:mm:ss'), valueType);
            return value.format('YYYY/MM/DD HH:mm:ss');
          }}
          onFinish={async (values) => {
            fn2(values.datetime);
            return true;
          }}
        >
          <ProFormDateTimePicker
            name="datetime"
            initialValue={moment('2021-08-09 12:12:12')}
            fieldProps={{ open: true }}
          />
        </ProForm>
      );
    };

    const wrapper = mount(<App />);
    await waitForComponentToPaint(wrapper);

    expect(fn1).toBeCalledWith('2021/08/09 12:12:12', 'dateTime');
    act(() => {
      wrapper.find('button.ant-btn-primary').at(1).simulate('click');
    });

    await waitForComponentToPaint(wrapper, 100);
    expect(fn2).toHaveBeenCalledWith('2021/08/09 12:12:12');

    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it(`π¦ rules change should rerender`, () => {
    const html = reactRender(
      <ProForm>
        <ProFormText
          width="md"
          rules={[
            {
              required: true,
              message: 'test',
            },
          ]}
          name="function"
          label="ηζζΉεΌ"
        />
      </ProForm>,
    );

    expect(html.baseElement.querySelectorAll('.ant-form-item-required').length).toBe(1);

    html.rerender(
      <ProForm>
        <ProFormText
          width="md"
          rules={[
            {
              required: false,
              message: 'test',
            },
          ]}
          name="function"
          label="ηζζΉεΌ"
        />
      </ProForm>,
    );

    expect(html.baseElement.querySelectorAll('.ant-form-item-required').length).toBe(0);
  });

  it('π¦ fix onChange will get empty object when you set labelInValue ture in ProForm', async () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <ProForm>
        <ProFormSelect
          fieldProps={{
            labelInValue: true,
            onChange(value) {
              onChange(value);
            },
          }}
          name="userQuery"
          label="ζ₯θ―’ιζ©ε¨"
          valueEnum={{
            all: { text: 'ε¨ι¨', status: 'Default' },
            open: {
              text: 'ζͺθ§£ε³',
              status: 'Error',
            },
            closed: {
              text: 'ε·²θ§£ε³',
              status: 'Success',
            },
            processing: {
              text: 'θ§£ε³δΈ­',
              status: 'Processing',
            },
          }}
        />
      </ProForm>,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-select-selector').simulate('mousedown');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);
    // ιδΈ­η¬¬δΈδΈͺ
    act(() => {
      wrapper.find('.ant-select-item').at(0).simulate('click');
      wrapper.update();
    });

    await waitForComponentToPaint(wrapper);

    // ιΌ ζ η§»ε₯ιδΈ­εΊε
    act(() => {
      wrapper.find('.ant-select').simulate('mouseenter');
      wrapper.update();
    });
    await waitForComponentToPaint(wrapper);

    // ηΉε»ε ι€ζι?θΏθ‘ε ι€ζδ½
    act(() => {
      wrapper.find('span.ant-select-clear').last().simulate('mousedown');
    });
    await waitForComponentToPaint(wrapper);

    expect(onChange).toBeCalledWith(undefined);
  });
});
