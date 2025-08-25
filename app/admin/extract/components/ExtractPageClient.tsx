"use client";

import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import RobotRegisterForm from './RobotRegisterForm';
import RobotSearchPage from './RobotSearchPage';
import VisitRegisterForm from './VisitRegisterForm';
import VisitSchedulePage from './VisitSchedulePage';
import SiheungMapView from './SiheungMapView';
import type { TabType, RobotSearchFilters, MapCoordinates } from '../types';

export default function ExtractPageClient() {
  const [activeTab, setActiveTab] = useState<TabType>('robot-register');
  const [selectedCoordinates, setSelectedCoordinates] = useState<MapCoordinates | null>(null);

  const handleRobotSearch = (filters: RobotSearchFilters) => {
    console.log('Robot search filters:', filters);
    // TODO: Implement robot search logic
  };

  const handleRobotSearchReset = () => {
    console.log('Robot search reset');
    // TODO: Implement robot search reset logic
  };

  const handleCoordinateSelect = (x: number, y: number) => {
    setSelectedCoordinates({ x, y });
    console.log(`선택된 좌표: x=${x}, y=${y}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'robot-register':
        return (
          <RobotRegisterForm
            onSave={(data) => {
              console.log('Robot registration data:', data);
              // TODO: Implement save logic
            }}
          />
        );
      case 'robot-search':
        return (
          <RobotSearchPage
            onSearch={handleRobotSearch}
            onReset={handleRobotSearchReset}
          />
        );
      case 'visit-register':
        return (
          <VisitRegisterForm
            onSave={(data) => {
              console.log('Visit registration data:', data);
              // TODO: Implement save logic
            }}
          />
        );
      case 'visit-schedule':
        return <VisitSchedulePage />;
      case 'siheung-map':
        return (
          <SiheungMapView
            onCoordinateSelect={handleCoordinateSelect}
            selectedCoordinates={selectedCoordinates}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </>
  );
}
