import Link from 'next/link'

export type Trip = {
  id: string
  user_id: string
  my_name: string
  my_phone: string | null
  traveler_name: string
  traveler_age: number | null
  traveler_languages: string[] | null
  origin: string
  destination: string
  booking_status: string
  flight_date: string | null
  flight_number: string | null
  airline: string | null
  date_range_start: string | null
  date_range_end: string | null
  companion_type: string
  needs_help_with: string[] | null
  notes: string | null
  created_at: string
}

export type TripCardVariant = 'own' | 'volunteer' | 'seeking'

type IconProps = { className?: string }

const iconBase = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
}

function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function PlaneIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  )
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18M8 2v4M16 2v4" />
    </svg>
  )
}

function AccessibilityIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <circle cx="16" cy="4" r="1" />
      <path d="M18 19l-2.5-6.5L11 11l1-4 4 1 2 2M12 11v3a4 4 0 1 0 4 4" />
    </svg>
  )
}

function MessageIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    </svg>
  )
}

function LuggageIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <rect width="12" height="14" x="6" y="6" rx="2" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M8 20v1M16 20v1" />
    </svg>
  )
}

function MapIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />
    </svg>
  )
}

function RepeatIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <path d="m17 2 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function HeartIcon({ className }: IconProps) {
  return (
    <svg className={className} {...iconBase}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  )
}

const HELP_META: Record<string, { label: string; Icon: (p: IconProps) => React.ReactElement }> = {
  wheelchair: { label: 'Wheelchair', Icon: AccessibilityIcon },
  language: { label: 'Language', Icon: MessageIcon },
  first_time: { label: 'First time', Icon: PlaneIcon },
  connecting_flight: { label: 'Connections', Icon: RepeatIcon },
  baggage: { label: 'Baggage', Icon: LuggageIcon },
  navigation: { label: 'Navigation', Icon: MapIcon },
}

const VARIANT_META: Record<TripCardVariant, { accent: string; badge: string; label: string; showStar: boolean }> = {
  own: { accent: 'border-l-4 border-primary-500', badge: 'bg-primary-50 text-primary-700', label: 'Your trip', showStar: false },
  volunteer: { accent: 'border-l-4 border-helper-500', badge: 'bg-helper-50 text-helper-800', label: 'Willing to help', showStar: true },
  seeking: { accent: 'border-l-4 border-seeker-500', badge: 'bg-seeker-50 text-seeker-800', label: 'Looking for a companion', showStar: false },
}

function formatDate(dateString: string | null) {
  if (!dateString) return ''
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function parseRoute(location: string): { code: string; city: string } {
  const match = location?.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (match) return { city: match[1].trim(), code: match[2].trim() }
  return { code: location, city: '' }
}

function dateLabel(trip: Trip) {
  if (trip.booking_status === 'confirmed' && trip.flight_date) return formatDate(trip.flight_date)
  if (trip.date_range_start && trip.date_range_end) {
    return `${formatDate(trip.date_range_start)} – ${formatDate(trip.date_range_end)}`
  }
  return 'Dates TBD'
}

export interface TripCardProps {
  trip: Trip
  variant: TripCardVariant
  isPast: boolean
  isSignedIn: boolean
  compact?: boolean
  onContact?: (trip: Trip) => void
}

export default function TripCard({ trip, variant, isPast, isSignedIn, compact = false, onContact }: TripCardProps) {
  const meta = VARIANT_META[variant]
  const origin = parseRoute(trip.origin)
  const destination = parseRoute(trip.destination)
  const isConfirmed = trip.booking_status === 'confirmed'

  const roleLabel =
    variant === 'volunteer'
      ? 'Volunteer'
      : trip.traveler_name?.trim().toLowerCase() === trip.my_name?.trim().toLowerCase()
        ? 'Posted by'
        : 'Traveling'

  const cardClasses = [
    'rounded-xl bg-white overflow-hidden border transition',
    isPast
      ? 'border-stone-200 border-l-4 border-l-stone-300 opacity-70'
      : `border-stone-200 shadow-sm hover:shadow-md ${meta.accent}`,
  ].join(' ')

  const Route = (
    <div className="flex items-center justify-center gap-3">
      <div className="text-center">
        <div className={`font-bold tracking-tight text-stone-900 ${compact ? 'text-lg' : 'text-2xl'}`}>{origin.code}</div>
        {origin.city && !compact && <div className="text-xs text-stone-500">{origin.city}</div>}
      </div>
      <ArrowRightIcon className="h-5 w-5 shrink-0 text-primary-500" />
      <div className="text-center">
        <div className={`font-bold tracking-tight text-stone-900 ${compact ? 'text-lg' : 'text-2xl'}`}>{destination.code}</div>
        {destination.city && !compact && <div className="text-xs text-stone-500">{destination.city}</div>}
      </div>
    </div>
  )

  if (compact) {
    return (
      <div className={cardClasses}>
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">Completed</span>
            <span className="text-xs text-stone-400">{dateLabel(trip)}</span>
          </div>
          {Route}
          <div className="mt-2 text-center text-sm text-stone-500">{trip.traveler_name}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cardClasses}>
      <div className="p-5">
        {/* Status row */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${isPast ? 'bg-stone-100 text-stone-500' : meta.badge}`}>
            {meta.showStar && !isPast && <HeartIcon className="h-3.5 w-3.5" />}
            {isPast ? 'Completed' : meta.label}
          </span>
        </div>

        {/* Route hero */}
        {Route}

        {/* Date + booking status */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isConfirmed ? 'bg-confirmed-100 text-confirmed-700' : 'bg-flexible-100 text-flexible-700'
            }`}
          >
            {isConfirmed ? 'Confirmed' : 'Flexible dates'}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-stone-600">
            <CalendarIcon className="h-3.5 w-3.5 text-stone-400" />
            {dateLabel(trip)}
          </span>
        </div>

        {/* Traveler */}
        <div className="mt-4 border-t border-stone-100 pt-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{roleLabel}</div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold text-stone-900">{trip.traveler_name}</h3>
            {trip.traveler_age && <span className="text-xs text-stone-500">{trip.traveler_age}y</span>}
          </div>
        </div>

        {/* Flight info */}
        {isConfirmed && trip.airline && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-stone-500">
            <PlaneIcon className="h-3.5 w-3.5" />
            {trip.airline}
            {trip.flight_number && ` ${trip.flight_number}`}
          </div>
        )}

        {/* Languages */}
        {trip.traveler_languages && trip.traveler_languages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {trip.traveler_languages.slice(0, 3).map((lang) => (
              <span key={lang} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                {lang}
              </span>
            ))}
            {trip.traveler_languages.length > 3 && (
              <span className="self-center text-xs text-stone-400">+{trip.traveler_languages.length - 3}</span>
            )}
          </div>
        )}

        {/* Help needed */}
        {trip.needs_help_with && trip.needs_help_with.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {trip.needs_help_with.slice(0, 3).map((help) => {
              const hm = HELP_META[help]
              const Icon = hm?.Icon
              return (
                <span key={help} className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                  {Icon && <Icon className="h-3 w-3" />}
                  {hm?.label ?? help}
                </span>
              )
            })}
            {trip.needs_help_with.length > 3 && (
              <span className="self-center text-xs text-stone-400">+{trip.needs_help_with.length - 3} more</span>
            )}
          </div>
        )}

        {/* Notes */}
        {trip.notes && <p className="mt-3 line-clamp-1 text-xs italic text-stone-500">&ldquo;{trip.notes}&rdquo;</p>}

        {/* Posted by */}
        <div className="mt-3 text-xs text-stone-400">by {variant === 'own' ? 'You' : trip.my_name}</div>

        {/* Action */}
        <div className="mt-4">
          {variant === 'own' ? (
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-3 text-center">
              <p className="mb-1 text-sm font-medium text-primary-800">Your trip</p>
              <Link href="/my-trips" className="text-xs font-semibold text-primary-700 underline">
                Manage →
              </Link>
            </div>
          ) : isPast ? (
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center">
              <p className="text-sm text-stone-500">Trip has ended</p>
            </div>
          ) : !isSignedIn ? (
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 text-center">
              <p className="mb-1 text-sm text-stone-600">Sign in to contact</p>
              <Link href="/login" className="text-xs font-semibold text-primary-700 underline">
                Log in →
              </Link>
            </div>
          ) : (
            <button
              onClick={() => onContact?.(trip)}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
            >
              Contact
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
