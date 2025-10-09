'use client'

import { useState, useEffect, useRef } from 'react'
import { searchAirports, Airport } from '@/lib/airports'

type AirportAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  required?: boolean
}

export default function AirportAutocomplete({
  value,
  onChange,
  placeholder,
  label,
  required = false
}: AirportAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Airport[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    if (newValue.length >= 2) {
      const results = searchAirports(newValue)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectAirport = (airport: Airport) => {
    const displayValue = `${airport.city} (${airport.code})`
    setInputValue(displayValue)
    onChange(displayValue)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectAirport(suggestions[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.length >= 2) {
            const results = searchAirports(inputValue)
            setSuggestions(results)
            setShowSuggestions(results.length > 0)
          }
        }}
        onBlur={() => {
          // Small delay to allow clicking on suggestions
          setTimeout(() => {
            if (!inputValue.includes('(') && suggestions.length > 0) {
              // If user typed but didn't select, auto-select first match
              handleSelectAirport(suggestions[0])
            }
          }, 200)
        }}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((airport, index) => (
            <button
              key={`${airport.code}-${index}`}
              type="button"
              onClick={() => handleSelectAirport(airport)}
              className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition ${
                index === selectedIndex ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900">
                    {airport.city} <span className="text-indigo-600">({airport.code})</span>
                  </div>
                  <div className="text-sm text-gray-600">{airport.name}</div>
                </div>
                <div className="text-xs text-gray-500 ml-2">{airport.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Start typing city name or airport code (e.g., "San Francisco" or "SFO")
      </p>
    </div>
  )
}