import React from 'react';
import FacilityDomainClient from './FacilityDomainClient';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { domain: 'temperature' },
    { domain: 'pressure' },
    { domain: 'mass' },
    { domain: 'rf' },
    { domain: 'dimensions' },
    { domain: 'force' },
    { domain: 'torque' },
    { domain: 'acceleration' },
    { domain: 'sound' },
    { domain: 'lux' },
    { domain: 'flow' },
  ];
}

export default function GenericFacilityPage() {
  return <FacilityDomainClient />;
}
