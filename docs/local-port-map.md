# Local Development Port Map

Use the first port in each range as the normal local development port. Use the second port as the alternate port for fallback runs, production-start checks, or debugging after the primary process is stopped.

| Project | Primary Port | Alternate Port | Local URLs |
| --- | ---: | ---: | --- |
| St. Louis Creations | 3000 | 3001 | `http://127.0.0.1:3000`, `http://127.0.0.1:3001` |
| AcademAI-Website | 3002 | 3003 | `http://127.0.0.1:3002`, `http://127.0.0.1:3003` |
| ColdstoneSoap-Website | 3004 | 3005 | `http://127.0.0.1:3004`, `http://127.0.0.1:3005` |
| STL-Musicians-Website | 3006 | 3007 | `http://127.0.0.1:3006`, `http://127.0.0.1:3007` |
| DigitalEnergyMedia-Website | 3008 | 3009 | `http://127.0.0.1:3008`, `http://127.0.0.1:3009` |
| DigitalEnergyHoldings-Website | 3010 | 3011 | `http://127.0.0.1:3010`, `http://127.0.0.1:3011` |

## Notes

- Bind local servers to `127.0.0.1` unless a task specifically needs LAN access.
- Do not run two `next dev` processes for the same repo at the same time. Stop the existing process before switching to the alternate port.
- Keep project-specific README files aligned with this map.
