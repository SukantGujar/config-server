import '!style-loader!css-loader!font-awesome/css/font-awesome.min.css';

import React from 'react';
import NotificationsSystem from 'reapop';
import theme from 'reapop-theme-wybo';

export default (props)=>(<NotificationsSystem {...props} theme={theme} />);