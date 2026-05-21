import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type TabIconName = 'tasks' | 'settings';

const ICONS: Record<TabIconName, {active: string; inactive: string}> = {
  tasks: {active: 'clipboard-list', inactive: 'clipboard-list-outline'},
  settings: {active: 'cog', inactive: 'cog-outline'},
};

type Props = {
  name: TabIconName;
  color: string;
  size?: number;
  focused: boolean;
};

export const TabBarIcon: React.FC<Props> = ({name, color, size = 24, focused}) => {
  const iconName = focused ? ICONS[name].active : ICONS[name].inactive;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
};
