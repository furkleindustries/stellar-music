import React from 'react';
import { LocaleContext } from '../LocaleContext';

export const LocaleInput = ({ onChange }) => {
  const locale = React.useContext(LocaleContext);

  return (
    <div>
      <label>Location</label>
      <input
        type="text"
        placeholder={`e.g. "paris, fr", "new york, ny", "90210", etc.`}
        onChange={onChange}
        defaultValue={locale}
      />
    </div>
  );
};
