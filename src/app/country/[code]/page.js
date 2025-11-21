"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"

export default function CountryDetailPage() {
  const params = useParams()
  // Next.js hook se URL ka param mil raha
  let code = params?.code
  if (Array.isArray(code)) code = code[0]   // safety

  const [theme, setTheme] = useState("dark")
  const [country, setCountry] = useState(null)
  const [borderCountries, setBorderCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("detail code (from useParams):", code)

        if (!code) {
          throw new Error("No country code in URL")
        }

        // yahan ham alpha + fields use kar rahe hain
        // const url =
        //   `https://restcountries.com/v3.1/alpha/${code}` +
        //   "?fields=name,capital,region,subregion,population,flags,tld,currencies,languages,borders"

        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}` +
           "?fields=name,capital,region,subregion,population,flags,tld,currencies,languages,borders")
        console.log("alpha status:", res.status)

        if (!res.ok) {
          const body = await res.text()
          console.log("detail error body:", body)
          throw new Error(`Failed to fetch country: ${res.status}`)
        }

        const data = await res.json()
        const c = Array.isArray(data) ? data[0] : data
        setCountry(c)

        // border countries
        if (c?.borders?.length) {
          const bordersRes = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${c.borders.join(
              ","
            )}&fields=name,cca3`
          )
          if (bordersRes.ok) {
            const bordersData = await bordersRes.json()
            setBorderCountries(
              bordersData.map((b) => ({
                code: b.cca3,
                name: b.name.common,
              }))
            )
          }
        } else {
          setBorderCountries([])
        }
      } catch (err) {
        console.error("detail error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [code])

  // Wrapper just to reuse header + layout
  const Wrapper = ({ children }) => (
    <div className={theme}>
      <Header setTheme={setTheme} />
      <main className="bg-[var(--Main)] min-h-screen w-full lg:px-15 md:px-15 px-6 py-10">
        {children}
      </main>
    </div>
  )

  if (loading) {
    return (
      <Wrapper>
        <p className="text-[var(--Heading)]">Loading...</p>
      </Wrapper>
    )
  }

  if (error || !country) {
    return (
      <Wrapper>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-2 rounded bg-[var(--Header)] text-[var(--Heading)] shadow mb-8"
        >
          ← Back
        </Link>
        <p className="text-red-500">Failed to load country details.</p>
      </Wrapper>
    )
  }

  // -------- fields format --------
  const name = country?.name?.common || "Unknown"
  const nativeName =
    country?.name?.nativeName &&
    Object.values(country.name.nativeName)[0]?.common

  const flag = country?.flags?.png || country?.flags?.svg
  const population = country?.population?.toLocaleString() || "N/A"
  const region = country?.region || "N/A"
  const subregion = country?.subregion || "N/A"
  const capital = Array.isArray(country?.capital)
    ? country.capital[0]
    : country?.capital || "N/A"

  const tld = Array.isArray(country?.tld) ? country.tld.join(", ") : "N/A"

  const currencies = country?.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "N/A"

  const languages = country?.languages
    ? Object.values(country.languages).join(", ")
    : "N/A"

  return (
    <Wrapper>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-8 py-2 rounded bg-[var(--Header)] text-[var(--Heading)] shadow mb-12"
      >
        ← Back
      </Link>

      <section className="flex flex-col lg:flex-row gap-16 lg:items-center">
        {/* Flag */}
        <div className="flex-1">
          <img
            src={flag}
            alt={name}
            className="w-full max-w-xl rounded shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="flex-1 text-[var(--Heading)]">
          <h1 className="text-3xl font-extrabold mb-8">{name}</h1>

          <div className="flex flex-col md:flex-row gap-12 mb-8 text-sm">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Native Name: </span>
                {nativeName || name}
              </p>
              <p>
                <span className="font-semibold">Population: </span>
                {population}
              </p>
              <p>
                <span className="font-semibold">Region: </span>
                {region}
              </p>
              <p>
                <span className="font-semibold">Sub Region: </span>
                {subregion}
              </p>
              <p>
                <span className="font-semibold">Capital: </span>
                {capital}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Top Level Domain: </span>
                {tld}
              </p>
              <p>
                <span className="font-semibold">Currencies: </span>
                {currencies}
              </p>
              <p>
                <span className="font-semibold">Languages: </span>
                {languages}
              </p>
            </div>
          </div>

          {/* Border Countries */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-4 text-sm">
            <span className="font-semibold whitespace-nowrap">
              Border Countries:
            </span>
            <div className="flex flex-wrap gap-2">
              {borderCountries.length ? (
                borderCountries.map((b) => (
                  <Link
                    key={b.code}
                    href={`/country/${b.code}`}
                    className="px-4 py-1 rounded bg-[var(--Header)] text-[var(--Heading)] shadow text-xs"
                  >
                    {b.name}
                  </Link>
                ))
              ) : (
                <span className="text-[var(--Title)]">None</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  )
}
