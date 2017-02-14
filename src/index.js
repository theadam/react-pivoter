import React, { PropTypes } from 'react';

import { columnTree, dataGetterFrom } from './utils';
import OpenController from './open_controller';

export default function PivotTable(props) {
  const { renderHeader, renderCell, renderGroup, renderGroupHeaders,
    totalText, renderTotalGroup, renderTotalCell, config, data,
    className, spanGroups,
  } = props;
  const columns = columnTree(data, config);
  const dataGetter = dataGetterFrom(columns);

  return (
    <OpenController
      data={data}
      config={config}
      renderHeader={renderHeader}
      renderCell={renderCell}
      renderGroup={renderGroup}
      renderTotalCell={renderTotalCell}
      renderTotalGroup={renderTotalGroup}
      renderGroupHeaders={renderGroupHeaders}
      className={className}
      totalText={totalText}
      columnTree={columns}
      dataGetter={dataGetter}
      spanGroups={spanGroups}
    />
  );
}

PivotTable.propTypes = {
  data: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  renderHeader: PropTypes.func,
  renderCell: PropTypes.func,
  renderGroup: PropTypes.func,
  renderTotalCell: PropTypes.func,
  renderTotalGroup: PropTypes.func,
  renderGroupHeaders: PropTypes.func,
  className: PropTypes.string,
  totalText: PropTypes.string,
  spanGroups: PropTypes.bool,
};

