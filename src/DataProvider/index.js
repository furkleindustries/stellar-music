import React from 'react';
import {
  LocaleContext,
} from '../LocaleContext';

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
