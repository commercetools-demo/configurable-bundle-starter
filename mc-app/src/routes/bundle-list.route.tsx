import React from 'react';
import BundleListPage from '../components/pages/bundle-list-page';

type Props = {
  linkToWelcome: string;
};

const BundleListRoute = ({ linkToWelcome }: Props) => {
  return <BundleListPage parentUrl={linkToWelcome} />;
};

export default BundleListRoute;
