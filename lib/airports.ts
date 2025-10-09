export type Airport = {
  code: string
  city: string
  country: string
  name: string
}

export const airports: Airport[] = [
  // Major US Airports
  { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International Airport' },
  { code: 'LGA', city: 'New York', country: 'USA', name: 'LaGuardia Airport' },
  { code: 'EWR', city: 'Newark', country: 'USA', name: 'Newark Liberty International Airport' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', name: 'Los Angeles International Airport' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', name: 'San Francisco International Airport' },
  { code: 'ORD', city: 'Chicago', country: 'USA', name: "O'Hare International Airport" },
  { code: 'ATL', city: 'Atlanta', country: 'USA', name: 'Hartsfield-Jackson Atlanta International Airport' },
  { code: 'DFW', city: 'Dallas', country: 'USA', name: 'Dallas/Fort Worth International Airport' },
  { code: 'DEN', city: 'Denver', country: 'USA', name: 'Denver International Airport' },
  { code: 'SEA', city: 'Seattle', country: 'USA', name: 'Seattle-Tacoma International Airport' },
  { code: 'BOS', city: 'Boston', country: 'USA', name: 'Logan International Airport' },
  { code: 'MIA', city: 'Miami', country: 'USA', name: 'Miami International Airport' },
  { code: 'IAD', city: 'Washington DC', country: 'USA', name: 'Washington Dulles International Airport' },
  { code: 'DCA', city: 'Washington DC', country: 'USA', name: 'Ronald Reagan Washington National Airport' },
  { code: 'PHX', city: 'Phoenix', country: 'USA', name: 'Phoenix Sky Harbor International Airport' },
  { code: 'IAH', city: 'Houston', country: 'USA', name: 'George Bush Intercontinental Airport' },
  { code: 'MSP', city: 'Minneapolis', country: 'USA', name: 'Minneapolis-St Paul International Airport' },
  { code: 'DTW', city: 'Detroit', country: 'USA', name: 'Detroit Metropolitan Airport' },
  { code: 'PHL', city: 'Philadelphia', country: 'USA', name: 'Philadelphia International Airport' },
  { code: 'LAS', city: 'Las Vegas', country: 'USA', name: 'Harry Reid International Airport' },
  { code: 'MCO', city: 'Orlando', country: 'USA', name: 'Orlando International Airport' },
  { code: 'CLT', city: 'Charlotte', country: 'USA', name: 'Charlotte Douglas International Airport' },
  { code: 'PDX', city: 'Portland', country: 'USA', name: 'Portland International Airport' },
  { code: 'SAN', city: 'San Diego', country: 'USA', name: 'San Diego International Airport' },
  { code: 'SLC', city: 'Salt Lake City', country: 'USA', name: 'Salt Lake City International Airport' },
  { code: 'TPA', city: 'Tampa', country: 'USA', name: 'Tampa International Airport' },
  { code: 'BNA', city: 'Nashville', country: 'USA', name: 'Nashville International Airport' },
  { code: 'AUS', city: 'Austin', country: 'USA', name: 'Austin-Bergstrom International Airport' },
  { code: 'RDU', city: 'Raleigh-Durham', country: 'USA', name: 'Raleigh-Durham International Airport' },
  
  // Major Indian Airports
  { code: 'DEL', city: 'Delhi', country: 'India', name: 'Indira Gandhi International Airport' },
  { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj International Airport' },
  { code: 'BLR', city: 'Bangalore', country: 'India', name: 'Kempegowda International Airport' },
  { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International Airport' },
  { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International Airport' },
  { code: 'CCU', city: 'Kolkata', country: 'India', name: 'Netaji Subhas Chandra Bose International Airport' },
  { code: 'AMD', city: 'Ahmedabad', country: 'India', name: 'Sardar Vallabhbhai Patel International Airport' },
  { code: 'PNQ', city: 'Pune', country: 'India', name: 'Pune Airport' },
  { code: 'COK', city: 'Kochi', country: 'India', name: 'Cochin International Airport' },
  { code: 'GOI', city: 'Goa', country: 'India', name: 'Goa International Airport' },
  { code: 'TRV', city: 'Trivandrum', country: 'India', name: 'Trivandrum International Airport' },
  { code: 'JAI', city: 'Jaipur', country: 'India', name: 'Jaipur International Airport' },
  { code: 'LKO', city: 'Lucknow', country: 'India', name: 'Chaudhary Charan Singh International Airport' },
  { code: 'IXC', city: 'Chandigarh', country: 'India', name: 'Chandigarh International Airport' },
  { code: 'NAG', city: 'Nagpur', country: 'India', name: 'Dr. Babasaheb Ambedkar International Airport' },
  { code: 'VNS', city: 'Varanasi', country: 'India', name: 'Lal Bahadur Shastri International Airport' },
  { code: 'IXB', city: 'Bagdogra', country: 'India', name: 'Bagdogra Airport' },
  { code: 'SXR', city: 'Srinagar', country: 'India', name: 'Sheikh ul-Alam International Airport' },
  { code: 'IDR', city: 'Indore', country: 'India', name: 'Devi Ahilyabai Holkar Airport' },
  { code: 'BBI', city: 'Bhubaneswar', country: 'India', name: 'Biju Patnaik International Airport' },

  // UK airports
  { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow Airport' },
  { code: 'LGW', city: 'London', country: 'UK', name: 'Gatwick Airport' },

  // Canada
  { code: 'YYZ', city: 'Toronto', country: 'Canada', name: 'Toronto Pearson International Airport' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', name: 'Vancouver International Airport' },
]

// Search function
export function searchAirports(query: string): Airport[] {
  if (!query || query.length < 2) return []
  
  const lowerQuery = query.toLowerCase()
  
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 8) // Limit to 8 results
}