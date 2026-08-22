/**
 * Itinerary Export and Printable Formatter Utilities
 */

/**
 * Downloads a structured JSON export of the trip
 */
export function exportTripToJson(trip) {
  if (!trip) return;
  const fileName = `${(trip.name || 'Trip').replace(/\s+/g, '_')}_GlobeTrotter_Itinerary.json`;
  const jsonStr = JSON.stringify(trip, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports itinerary summary as a downloadable CSV table
 */
export function exportTripToCsv(trip) {
  if (!trip) return;
  const rows = [
    ['Stop #', 'City', 'Country', 'Start Date', 'End Date', 'Activity Name', 'Category', 'Cost', 'Duration']
  ];

  (trip.stops || []).forEach((stop, idx) => {
    const cityName = stop.city?.name || stop.city || 'City';
    const country = stop.city?.country || 'India';
    const sDate = stop.startDate || '';
    const eDate = stop.endDate || '';

    if (!stop.activities || stop.activities.length === 0) {
      rows.push([idx + 1, cityName, country, sDate, eDate, 'No activities scheduled', '-', 0, '-']);
    } else {
      stop.activities.forEach(act => {
        rows.push([
          idx + 1,
          cityName,
          country,
          sDate,
          eDate,
          `"${act.name}"`,
          act.category || 'Sightseeing',
          act.cost || 0,
          `"${act.duration || ''}"`
        ]);
      });
    }
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${(trip.name || 'Trip').replace(/\s+/g, '_')}_Summary.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
