import React from 'react';
import { useParams } from 'react-router';
import BundleDetailsPage from '../components/pages/bundle-details-page';

type Props = {
  linkToWelcome: string;
};

const BundleRoute = (props: Props) => {
  return <BundleDetailsPage />;
};

export default BundleRoute;
