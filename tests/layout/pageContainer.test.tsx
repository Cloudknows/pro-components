import type { BasicLayoutProps } from '@ant-design/pro-components';
import { BasicLayout, FooterToolbar, PageContainer } from '@ant-design/pro-components';
import { render as libraryRender } from '@testing-library/react';
import { mount, render } from 'enzyme';
import React, { useEffect, useMemo, useState } from 'react';
import { act } from 'react-dom/test-utils';
import { waitForComponentToPaint } from '../util';

describe('PageContainer', () => {
  it('π base use', async () => {
    const html = render(<PageContainer title="ζθ΄€" />);
    expect(html).toMatchSnapshot();
  });

  it('π config is null', async () => {
    const html = render(<PageContainer />);
    expect(html).toMatchSnapshot();
  });

  it('π title,ghost,header,breadcrumbRender = false', async () => {
    const html = mount(
      <PageContainer title={false} ghost={false} header={undefined} breadcrumbRender={false}>
        qixian
      </PageContainer>,
    );
    expect(html.find('.ant-page-header').exists()).toBeFalsy();
  });

  it('π pageContainer support breadcrumbRender', async () => {
    const html = mount(
      <PageContainer breadcrumbRender={() => <div>θΏιζ―ι’εε±</div>}>content</PageContainer>,
    );
    expect(html.find('.has-breadcrumb').at(0).find('div div').text()).toBe('θΏιζ―ι’εε±');
  });

  it('π pageContainer support tabBarExtraContent', async () => {
    const html = mount(<PageContainer tabBarExtraContent="ζ΅θ―">content</PageContainer>);
    expect(html.find('.ant-tabs-extra-content').at(0).find('div').text()).toBe('ζ΅θ―');
  });

  it('β‘οΈ support footer', async () => {
    const wrapper = mount(
      <PageContainer
        title="ζθ΄€"
        footer={[
          <button type="button" key="button">
            right
          </button>,
        ]}
      />,
    );
    expect(wrapper?.find('.ant-pro-page-container-with-footer').length).toBe(1);
    const html = wrapper.render();
    expect(html).toMatchSnapshot();
  });

  it('β‘οΈ support fixedHeader', async () => {
    const html = render(<PageContainer title="ζθ΄€" fixedHeader />);
    expect(html).toMatchSnapshot();
  });

  it('β‘οΈ support fixHeader', async () => {
    const html = render(<PageContainer title="ζθ΄€" fixHeader />);
    expect(html).toMatchSnapshot();
  });

  it('β‘οΈ support loading', async () => {
    const html = render(<PageContainer title="ζθ΄€" loading />);
    expect(html).toMatchSnapshot();
  });

  it('β‘οΈ support more loading props', async () => {
    const html = render(<PageContainer title="ζθ΄€" loading={{ spinning: true, tip: 'ε θ½½δΈ­' }} />);
    expect(html).toMatchSnapshot();
  });

  it('π₯ support footer and breadcrumb', async () => {
    const html = render(
      <PageContainer
        title="ζθ΄€"
        breadcrumb={{
          routes: [
            {
              path: '/',
              breadcrumbName: 'home',
            },
          ],
        }}
        footer={[
          <button key="right" type="button">
            right
          </button>,
        ]}
      />,
    );
    expect(html).toMatchSnapshot();
  });

  it('π₯ footer bar support extra', async () => {
    const html = render(
      <FooterToolbar
        className="qixian_footer"
        extra={
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="logo"
          />
        }
      >
        <button key="button" type="button">
          right
        </button>
      </FooterToolbar>,
    );
    expect(html).toMatchSnapshot();
  });

  it('π₯ footer bar support renderContent', async () => {
    const html = render(
      <FooterToolbar
        className="qixian_footer"
        extra={
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            alt="logo"
          />
        }
        renderContent={() => {
          return 'home_toolbar';
        }}
      >
        <button key="button" type="button">
          right
        </button>
      </FooterToolbar>,
    );
    expect(html).toMatchSnapshot();
  });

  it('π² footer should know width', async () => {
    const wrapper = mount<BasicLayoutProps>(
      <BasicLayout>
        <PageContainer
          title="ζθ΄€"
          footer={[
            <button type="button" key="button">
              qixian
            </button>,
          ]}
        />
      </BasicLayout>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper?.find('.ant-pro-footer-bar')?.props()?.style?.width).toBe('calc(100% - 208px)');
    act(() => {
      wrapper.setProps({
        collapsed: true,
      });
    });

    await waitForComponentToPaint(wrapper);

    expect(wrapper?.find('.ant-pro-footer-bar')?.props()?.style?.width).toBe('calc(100% - 48px)');
    act(() => {
      wrapper.setProps({
        layout: 'top',
      });
    });
    expect(wrapper?.find('.ant-pro-footer-bar')?.props()?.style?.width).toBe('100%');
    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('π² FooterToolbar should know width', async () => {
    const wrapper = mount<BasicLayoutProps>(
      <BasicLayout>
        <PageContainer>
          <FooterToolbar>
            <button type="button" key="button">
              qixian
            </button>
          </FooterToolbar>
        </PageContainer>
      </BasicLayout>,
    );
    await waitForComponentToPaint(wrapper);

    expect(wrapper?.find('.ant-pro-footer-bar')?.props()?.style?.width).toBe('calc(100% - 208px)');
    act(() => {
      wrapper.setProps({
        collapsed: true,
      });
    });

    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-pro-footer-bar')?.props()?.style?.width).toBe('calc(100% - 48px)');
    act(() => {
      wrapper.setProps({
        layout: 'top',
      });
    });
    expect(wrapper.find('.ant-pro-footer-bar')?.props()?.style?.width).toBe('100%');
    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
    // test useUseEffect render function
    act(() => {
      wrapper.unmount();
    });
  });

  it('π² footer is null, do not render footerToolbar ', async () => {
    const wrapper = mount(
      <PageContainer
        footer={[
          <button type="button" key="button">
            qixian
          </button>,
        ]}
      />,
    );
    await waitForComponentToPaint(wrapper);
    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
    act(() => {
      wrapper.setProps({
        footer: undefined,
      });
    });
    await waitForComponentToPaint(wrapper);
    act(() => {
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  it('π² pro-layout support breadcrumbProps', async () => {
    const wrapper = render(
      <BasicLayout
        breadcrumbProps={{
          separator: '>',
          routes: [
            {
              path: 'index',
              breadcrumbName: 'home',
            },
            {
              path: 'first',
              breadcrumbName: 'first',
              children: [
                {
                  path: '/general',
                  breadcrumbName: 'General',
                },
                {
                  path: '/layout',
                  breadcrumbName: 'Layout',
                },
                {
                  path: '/navigation',
                  breadcrumbName: 'Navigation',
                },
              ],
            },
            {
              path: 'second',
              breadcrumbName: 'second',
            },
          ],
        }}
      >
        <PageContainer />
      </BasicLayout>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('π² header.footer is null, do not render footerToolbar ', async () => {
    const wrapper = mount(
      <PageContainer
        footer={[
          <button type="button" key="button">
            qixian
          </button>,
        ]}
      />,
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find('.ant-pro-footer-bar').exists()).toBeTruthy();
    act(() => {
      wrapper.setProps({ footer: undefined });
    });
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find('.ant-pro-footer-bar').exists()).toBeFalsy();
  });

  it('π² tabList and onTabChange is run', async () => {
    const fn = jest.fn();
    const wrapper = mount(
      <PageContainer
        title="ζ ι’"
        onTabChange={fn}
        tabList={[
          {
            tab: 'εΊζ¬δΏ‘ζ―',
            key: 'base',
          },
          {
            tab: 'θ―¦η»δΏ‘ζ―',
            key: 'info',
          },
        ]}
      />,
    );
    await waitForComponentToPaint(wrapper);

    act(() => {
      wrapper.find('.ant-tabs-nav-list .ant-tabs-tab').at(1).simulate('click');
    });

    expect(fn).toBeCalledWith('info');
  });

  it('π² content is text and title is null', () => {
    const html = render(<PageContainer content="just so so" />);
    expect(html).toMatchSnapshot();

    const html2 = render(<PageContainer extraContent={<div>extraContent</div>} />);
    expect(html2).toMatchSnapshot();
  });

  it('π className prop should not be passed to its page header, fix #3493', async () => {
    const wrapper = mount(
      <PageContainer
        className="custom-className"
        header={{
          title: 'ι‘΅ι’ζ ι’',
        }}
      />,
    );
    // ε―ΉδΊ enzyme 3.xοΌιδΌ δΈε»η classNameοΌη΄ζ₯ find ηη»ζζ°δΈΊ 2οΌεζΆεε« React η»δ»Άε?δΎε DOM θηΉοΌιθ¦η¨ hostNodes() ζΉζ³η­ιεΊ DOM θηΉ
    // issue: https://github.com/enzymejs/enzyme/issues/836#issuecomment-401260477
    expect(wrapper?.find('.custom-className').hostNodes().length).toBe(1);
    const html = wrapper.render();
    expect(html).toMatchSnapshot();
  });

  it('π PageContainer with custom loading', async () => {
    const App = () => {
      const loadingDom = useMemo(
        () => (
          <div id="customLoading" style={{ color: 'red', padding: '30px', textAlign: 'center' }}>
            θͺε?δΉε θ½½...
          </div>
        ),
        [],
      );
      const [loading, setLoading] = useState<React.ReactNode | false>(loadingDom);
      useEffect(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }, []);
      return (
        <PageContainer
          loading={loading}
          className="custom-className"
          header={{
            title: 'ι‘΅ι’ζ ι’',
          }}
        />
      );
    };

    const wrapper = libraryRender(<App />);
    await waitForComponentToPaint(wrapper);
    expect(wrapper.baseElement.querySelectorAll('#customLoading').length).toBe(1);
    expect(wrapper).toMatchSnapshot();
    await waitForComponentToPaint(wrapper, 1000);
    expect(wrapper.baseElement.querySelectorAll('#customLoading').length).toBe(0);
  });

  it('π breadcrumbRender and restProps?.header?.breadcrumbRender', async () => {
    const html = libraryRender(
      <PageContainer
        className="custom-className"
        breadcrumbRender={false}
        header={{
          breadcrumbRender: () => 'diss',
        }}
      />,
    );

    expect(html.container.innerText).toBe(undefined);

    html.rerender(
      <PageContainer
        className="custom-className"
        header={{
          breadcrumbRender: () => 'diss',
        }}
      />,
    );
    expect(html.container.getElementsByClassName('has-breadcrumb')[0].innerHTML).toBe('diss');
  });
});
