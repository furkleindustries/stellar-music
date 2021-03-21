import {
  LocaleContext,
} from './LocaleContext';

import React from 'react';

export const DataProvider = ({
  children,
  getDataPromise,
}) => {
  const locale = React.useContext(LocaleContext);
  if (locale && typeof getDataPromise === 'function') {
    const dataPromise = getDataPromise(locale);
    return children(dataPromise);
  }

  return null;
};
