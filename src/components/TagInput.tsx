'use client'

import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

interface TagInputProps {
  tags: string[]
  suggestions: readonly string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  placeholder: string
  className?: string
}

export default function TagInput({
  tags,
  suggestions,
  onAddTag,
  onRemoveTag,
  placeholder,
  className = ''
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (inputValue) {
      const filtered = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(suggestion)
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [inputValue, suggestions, tags])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleAddTag = () => {
    if (filteredSuggestions.length > 0) {
      const newTag = filteredSuggestions[0]
      if (!tags.includes(newTag)) {
        onAddTag(newTag)
      }
    } else if (inputValue && !tags.includes(inputValue)) {
      onAddTag(inputValue)
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      onAddTag(suggestion)
    }
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Tags Section */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-600 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
            >
              <span className="sr-only">Remove {tag}</span>
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      {/* Input and Suggestions Section */}
      <div className="relative">
        <div className="flex">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 min-w-[120px] p-2 border rounded-md outline-none text-sm"
          />
          {/* <button 
            onClick={handleAddTag}
            className="bg-indigo-500 text-white px-3 py-2 rounded-r-md hover:bg-indigo-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
          </button> */}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          >
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
              >
                <span className="block truncate">{suggestion}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}