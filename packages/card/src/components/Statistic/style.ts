import type { ProAliasToken } from '@ant-design/pro-utils';
import { useStyle as useAntdStyle } from '@ant-design/pro-utils';
import type { GenerateStyle } from 'antd/es/theme';

export interface ProListToken extends ProAliasToken {
  componentCls: string;
}

const genProStyle: GenerateStyle<ProListToken> = (token) => {
  return {
    [token.componentCls]: {
      display: 'flex',
      fontSize: token.fontSize,
      '& + &': {
        marginBlockStart: 4,
      },
      '&-tip': {
        marginInlineStart: 4,
      },
      '&-wrapper': { display: 'flex', width: '100%' },
      '&-icon': {
        marginInlineEnd: 16,
      },
      '&-trend-icon': {
        width: '0',
        height: '0',
        borderInlineEnd: '3.5px solid transparent',
        borderBlockEnd: '9px solid #000',
        borderInlineStart: '3.5px solid transparent',
        '&-up': { transform: 'rotate(0deg)' },
        '&-down': { transform: 'rotate(180deg)' },
      },
      '&-content': {
        width: '100%',
      },
      '&-description': {
        width: '100%',
      },
      [`${token.antCls}-statistic-title`]: {
        color: token.colorText,
      },
      '&-layout-inline': {
        display: 'inline-flex',
        color: token.colorTextSecondary,
        [`${token.antCls}-statistic-title`]: {
          marginInlineEnd: '6px',
          marginBlockEnd: '0',
        },
        [`${token.antCls}-statistic-content`]: {
          color: token.colorTextSecondary,
        },
        [`${token.antCls}-statistic-title,${token.antCls}-statistic-content,${token.antCls}-statistic-content-suffix,${token.antCls}-statistic-content-prefix,${token.antCls}-statistic-content-value-decimal`]:
          {
            fontSize: token.fontSizeSM,
          },
        '&-layout-horizontal': {
          display: 'flex',
          justifyContent: 'space-between',
          [`${token.antCls}-statistic-title`]: {
            marginBlockEnd: '0',
          },
          [`${token.antCls}-statistic-content-value`]: {
            fontWeight: 500,
          },
          [`${token.antCls}-statistic-title,${token.antCls}-statistic-content,${token.antCls}-statistic-content-suffix,${token.antCls}-statistic-content-prefix,${token.antCls}-statistic-content-value-decimal`]:
            {
              fontSize: token.fontSizeSM,
            },
        },
        '&-trend-up': {
          [`${token.antCls}-statistic-content`]: {
            color: '#f5222d',
            [`${token.componentCls}--trend-icon`]: {
              borderBottomColor: '#f5222d',
            },
          },
        },
        '&-trend-down': {
          [`${token.antCls}-statistic-content`]: {
            color: '#389e0d',
            [`${token.componentCls}--trend-icon`]: {
              borderBottomColor: '#52c41a',
            },
          },
        },
      },
    },
  };
};

export function useStyle(prefixCls: string) {
  return useAntdStyle('Statistic', (token) => {
    const proListToken: ProListToken = {
      ...token,
      componentCls: `.${prefixCls}`,
    };

    return [genProStyle(proListToken)];
  });
}