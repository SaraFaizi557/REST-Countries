"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

const Card = ({ search, region }) => {
  const [countries, setCountries] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca3"
        )
        if (!res.ok) throw new Error("Failed to fetch countries")
        const data = await res.json()
        setCountries(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [])

  const filteredCountries = countries.filter((country) => {
    const name = country?.name?.common || ""
    const countryRegion = country?.region || ""

    const matchesSearch = name
      .toLowerCase()
      .includes(search.trim().toLowerCase())

    const matchesRegion = region
      ? countryRegion.toLowerCase() === region.toLowerCase()
      : true

    return matchesSearch && matchesRegion
  })

  if (loading)
    return <div className="flex items-center justify-center text-[var(--Heading)]">Loading...</div>
  if (error) return <div className="flex items-center justify-center text-red-500">Error: {error}</div>

  return (
    <div className="bg-[var(--Main)] lg:px-15 md:px-15 px-6 py-9 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 justify-between lg:gap-10 md:gap-8 sm:gap-6 gap-6">
      {filteredCountries.map((country) => {
        const name = country?.name?.common || "Unknown"
        const flag = country?.flags?.png || country?.flags?.svg
        const population = country?.population?.toLocaleString() || "N/A"
        const countryRegion = country?.region || "N/A"
        const capital = Array.isArray(country?.capital)
          ? country.capital[0]
          : country?.capital || "N/A"

        return (
          <Link
            key={country.cca3}
            href={`/country/${country.cca3}`}
            className="w-full rounded-xs flex flex-col bg-[var(--Header)] shadow hover:-translate-y-1 hover:shadow-lg transition"
          >
            <img
              className="rounded-xs w-full h-40 object-cover"
              src={flag}
              alt={name}
            />

            <div className="py-6 px-7 text-[var(--Heading)] font-semibold lg:text-xl md:text-xl text-lg">
              <h4 className="mb-4">{name}</h4>

              <div className="leading-6 space-y-1 text-[15px]">
                <p className="font-light text-[var(--Title)]">
                  <span className="font-semibold mr-1">Population:</span>
                  {population}
                </p>
                <p className="font-light text-[var(--Title)]">
                  <span className="font-semibold mr-1">Region:</span>
                  {countryRegion}
                </p>
                <p className="font-light text-[var(--Title)]">
                  <span className="font-semibold mr-1">Capital:</span>
                  {capital}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Card
