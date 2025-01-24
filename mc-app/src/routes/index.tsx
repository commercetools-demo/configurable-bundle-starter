import type { ReactNode } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import SchemasRoute from './schemas.route';
import BundleListRoute from './bundle-list.route';
import BundleRoute from './bundle.route';
import CreateBundleRoute from './create-bundle.route';
import SchemaRoute from './schema.route';
import CreateSchemaRoute from './create-schema.route';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/schema/new`}>
          <CreateSchemaRoute linkToWelcome={match.url} />
        </Route>
        <Route path={`${match.path}/schema/:id`}>
          <SchemaRoute linkToWelcome={match.url} />
        </Route>
        <Route path={`${match.path}/schemas`}>
          <SchemasRoute linkToWelcome={match.url} />
        </Route>
        <Route path={`${match.path}/bundle/new`}>
          <CreateBundleRoute linkToWelcome={match.url} />
        </Route>
        <Route path={`${match.path}/bundle/:id`}>
          <BundleRoute linkToWelcome={match.url} />
        </Route>
        <Route>
          <BundleListRoute linkToWelcome={match.url} />
        </Route>
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
