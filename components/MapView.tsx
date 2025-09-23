// components/MapView.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
// Removed: import { districtData } from '@/lib/surveyData';
import { loadCSVFromUrl, processSurveyData } from '@/lib/csvUtils'; // Added import

interface MapViewProps {
  selectedDistrict: string | null;
  onDistrictSelect: (district: string) => void;
  districtsGeoJsonUrl?: string; // Your additional props
  pointsCsvUrl?: string;
}

interface GeoJsonFeature {
  type: "Feature";
  properties: { [key: string]: any };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface GeoJsonData {
  type: string;
  features: GeoJsonFeature[];
}

interface PointData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  district: string;
  category: string;
}

export default function MapView({
  selectedDistrict,
  onDistrictSelect,
  districtsGeoJsonUrl,
  pointsCsvUrl
}: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [geoData, setGeoData] = useState<GeoJsonData | null>(null);
  const [pointsData, setPointsData] = useState<PointData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surveyDistricts, setSurveyDistricts] = useState<any[]>([]); // Added state for survey districts
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load GeoJSON data
  useEffect(() => {
    if (districtsGeoJsonUrl) {
      setLoading(true);
      fetch(districtsGeoJsonUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.status}`);
          }
          return response.json();
        })
        .then((data: GeoJsonData) => {
          setGeoData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading GeoJSON:', err);
          setError('Не удалось загрузить данные районов');
          setLoading(false);
        });
    }
  }, [districtsGeoJsonUrl]);

  // Load CSV points data
  useEffect(() => {
    if (pointsCsvUrl) {
      fetch(pointsCsvUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load CSV: ${response.status}`);
          }
          return response.text();
        })
        .then(csvText => {
          // Simple CSV parsing (you might want to use a proper CSV parser)
          const lines = csvText.split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          const points: PointData[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= headers.length) {
              points.push({
                id: values[0] || `point_${i}`,
                name: values[1] || 'Unknown',
                lat: parseFloat(values[2]) || 0,
                lng: parseFloat(values[3]) || 0,
                district: values[4] || 'Unknown',
                category: values[5] || 'Other'
              });
            }
          }
          
          setPointsData(points);
        })
        .catch(err => {
          console.error('Error loading CSV points:', err);
          setError('Не удалось загрузить данные точек');
        });
    }
  }, [pointsCsvUrl]);

  // Load and process survey data for districts
  useEffect(() => {
      const fetchSurveyData = async () => {
          try {
              const csvUrl = '/data/questionnaire_sport_survey.csv'; // Assuming this is the correct path
              const csvData = await loadCSVFromUrl(csvUrl);
              const processed = processSurveyData(csvData);
              setSurveyDistricts(processed.districts);
          } catch (err) {
              console.error('Error loading survey districts:', err);
              // Handle error, maybe set an error state
          }
      };
      fetchSurveyData();
  }, []);


  // Handle iframe load
  const handleIframeLoad = () => {
    setMapLoaded(true);
    setShowPlaceholder(false);
    
    // Send data to iframe if it's loaded
    if (iframeRef.current && (geoData || pointsData.length > 0)) {
      const message = {
        type: 'map-data',
        geoData,
        pointsData,
        selectedDistrict
      };
      
      iframeRef.current.contentWindow?.postMessage(message, '*');
    }
  };

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Add your domain check here for security
      if (event.data && event.data.type === 'district-click') {
        console.log("District clicked in HTML Map (received by MapView):", event.data.district); // Added console.log
        onDistrictSelect(event.data.district);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onDistrictSelect]);

  // Send selected district updates to iframe
  useEffect(() => {
    if (iframeRef.current && mapLoaded) {
      const message = {
        type: 'district-selected',
        district: selectedDistrict
      };
      iframeRef.current.contentWindow?.postMessage(message, '*');
    }
  }, [selectedDistrict, mapLoaded]);

  // Use surveyDistricts for districtStats
  const districtStats = surveyDistricts.map(d => ({
    ...d,
    pointsCount: pointsData.filter(p => p.district === d.name).length
  }));

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Карта районов Алматы</h3>
          <p className="text-sm text-gray-600 mt-1">
            Интерактивная карта с результатами опроса
            {pointsData.length > 0 && ` • ${pointsData.length} объектов`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Загрузка...</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${ 
              error ? 'bg-red-500' : mapLoaded ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-xs text-gray-500">
              {error ? 'Ошибка' : mapLoaded ? 'Готово' : 'Загрузка...'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Your HTML Map */}
        <iframe 
          ref={iframeRef}
          src="/map/Almaty_Smart_Recommendations_Fixed.html"
          className="w-full h-full border-0"
          title="Almaty Interactive Map"
          onLoad={handleIframeLoad}
          style={{
            display: showPlaceholder ? 'none' : 'block'
          }}
        />
        
        {/* Placeholder - shown until map loads */}
        {showPlaceholder && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Интерактивная карта Алматы
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {loading ? 'Загрузка данных...' : 'Инициализация карты...'}
                </p>
                <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 max-w-md">
                  {geoData && (
                    <p className="text-green-600 mb-1">
                      ✓ GeoJSON загружен ({geoData.features.length} районов)
                    </p>
                  )}
                  {pointsData.length > 0 && (
                    <p className="text-green-600 mb-1">
                      ✓ Загружено {pointsData.length} точек
                    </p>
                  )}
                  {error && (
                    <p className="text-red-600">{error}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Interactive district grid overlay for fallback */}
            <div className="absolute inset-4 grid grid-cols-4 gap-2 z-10">
              {surveyDistricts.slice(0, 8).map((district, _index) => (
                <div
                  key={district.name}
                  className={`
                    relative rounded-lg p-3 cursor-pointer transition-all duration-300 
                    hover:transform hover:scale-105 hover:z-20 backdrop-blur-sm
                    ${selectedDistrict === district.name 
                      ? 'ring-2 ring-indigo-500 ring-offset-2 transform scale-105 z-20' 
                      : 'hover:shadow-lg'
                    }
                  `}
                  style={{
                    backgroundColor: district.color + '30',
                    borderLeft: `4px solid ${district.color}`,
                  }}
                  onClick={() => onDistrictSelect(selectedDistrict === district.name ? '' : district.name)}
                >
                  <div className="text-xs font-semibold text-gray-700 truncate mb-1">
                    {district.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold" style={{ color: district.color }}>
                      {district.value}
                    </div>
                    <div className="text-xs text-gray-600">
                      {district.pointsCount > 0 && (
                        <div className="bg-green-100 text-green-700 px-1 rounded">
                          {district.pointsCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer with legend and stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {/* Legend */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Легенда</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Высокая активность</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Средняя активность</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Объекты спорта</span>
              </div>
            </div>
          </div>
          
          {/* Data Sources */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Источники данных</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${geoData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>GeoJSON районов</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${pointsData.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>CSV точек ({pointsData.length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Опрос (391 ответ)</span> {/* This text might need to be dynamic if total responses change */}
              </div>
            </div>
          </div>

          {/* Current Selection */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Текущий выбор</h4>
            {selectedDistrict ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                <div className="font-medium text-indigo-900 text-sm">{selectedDistrict}</div>
                <div className="text-xs text-indigo-700 mt-1">
                  {districtStats.find(d => d.name === selectedDistrict)?.value} ответов •{' '}
                  {districtStats.find(d => d.name === selectedDistrict)?.pointsCount || 0} объектов
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-xs">
                Кликните на район для просмотра деталей
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}