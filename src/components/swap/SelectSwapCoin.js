import * as React from 'react';
import PropTypes from 'prop-types';
import SelectUnstyled, { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled from '@mui/base/OptionUnstyled';
import { styled } from '@mui/system';
import { PopperUnstyled } from '@mui/base';
import api from '../../core/api';

const StyledButton = styled('button')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 1.2rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  background: transparent;
  border: none;
  text-align: left;
  line-height: 1.5;
  color: white;
  display: flex;
  flex-direction: row;
  width: 130px;
  justify-content: space-between;
  align-items: center;

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }

  & img, & span {
    margin-right: 8px;
    font-size: 16px;
    font-weight: bold;    
  }
  `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  font-family: 'Poppins';
  font-size: 16px;
  box-sizing: border-box;
  padding: 5px;
  margin: 0px 0;
  background: rgb(21,27,52);
  border-radius: 0.75em;
  color: white;
  overflow: auto;
  outline: 0px;
  `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  background: rgb(21,27,52);
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: default;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 130px;
  &:hover {
    background: rgb(8, 15, 42);
  }
  &:last-of-type {
    border-bottom: none;
  }
  & img {
    margin-right: 10px;
  }`,
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`;

const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
  const components = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
});

CustomSelect.propTypes = {
  /**
   * The components used for each slot inside the Select.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  components: PropTypes.shape({
    Listbox: PropTypes.elementType,
    Popper: PropTypes.func,
    Root: PropTypes.elementType,
  }),
};

const def_coins = [
  { code: 0, label: 'AVAX' },
  { code: 1, label: 'USDC' }
];

export default function UnstyledSelectRichOptions({ value, coins = def_coins, onChange, disabled }) {
  return (
    <CustomSelect defaultValue={0} value={value} onChange={onChange} disabled={disabled}>
      {coins.map((c) => (
        <StyledOption key={c.code} value={c.code}>
          <img
            loading="lazy"
            width="30"
            src={api.rootUrl + `/img/icons/${c.label.toLowerCase()}.png`}
            alt={`Coin of ${c.label}`}
          />
          <span>{c.label}</span>
        </StyledOption>
      ))}
    </CustomSelect>
  );
}