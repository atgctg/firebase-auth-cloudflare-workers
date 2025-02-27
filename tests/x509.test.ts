import { describe, it, expect } from 'vitest';
import { jwkFromX509 } from '../src/x509';
import type { JsonWebKeyWithKid } from '@cloudflare/workers-types';

const relyingpartyPublicKeys: Record<string, string> = {
  'bZ-_5g':
    '-----BEGIN CERTIFICATE-----\nMIIDHDCCAgSgAwIBAgIEHMOyTzANBgkqhkiG9w0BAQsFADAzMQ8wDQYDVQQDEwZH\naXRraXQxEzARBgNVBAoTCkdvb2dsZSBJbmMxCzAJBgNVBAYTAlVTMB4XDTI0MTIw\nNjAyMjUzM1oXDTI1MTIwMTAyMjUzM1owMzEPMA0GA1UEAxMGR2l0a2l0MRMwEQYD\nVQQKEwpHb29nbGUgSW5jMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBANyVAukjUNaA9z55PCK3I803APf7g5o+x+h89pOhFQdeHZd+\nAMamdbtLsbmgfZ0lxTaIAbaEdWW9ZLFTLbsO9F8Vc38n0goxdnngS85d1stih0Wm\nY2p04qAkuyFpjVMGLoTtcep9rguc+0UuDTBya0PsEsltE0Dgt8HVGl8ZFnF4QNY4\ncIFl/JTF0JPpGxCj801L/Za+KMneni1bMPxdn7NThoVbw39MVqdIYTjnWxFnDnZ5\nUSLIxOhFHtCaf6kQw3uNkykiZiM90XzADEb3RU1uShEweuSh/W890tnG8uXOe34/\nMVSRvwcbD4sJvMC4EKsYzzJ4mN/i4GC5gHfSjyMCAwEAAaM4MDYwDAYDVR0TAQH/\nBAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCB4AwDQYJ\nKoZIhvcNAQELBQADggEBAJCNjAzki0cnWXSZZ17xVFCqbJwDjaubMVSPrGBvdiZP\nQyDNQc9BNKO57ui/rK1KhPh3TA/g5BElVjqsJa19WcUh9klG0bCRQyuiKyMg56WG\nIv/z7exyj5AeF8/Tk2pLws5LhhBpKN3gfiX+IIr+1dM2iaBN0PTk7+nUo2Yf7Zwg\nYlxXke96Xdi7mKNjT+0gd8C0D0A4PZeqKvEfACwHfbXc5jdIDmhl2yVbuNfAMAGR\nmJYbg3tMyH1gG+Yey8M87cPdUaivprn2wvBPAJAAsV6umdKlJgN/Qd7zZ7irGgfQ\nZMT3wPNaSlwZRbMow3gQCnwUAiAM6uTju32jbbhQE/8=\n-----END CERTIFICATE-----\n',
  _aLBDQ:
    '-----BEGIN CERTIFICATE-----\nMIIDHDCCAgSgAwIBAgIEBlNmITANBgkqhkiG9w0BAQsFADAzMQ8wDQYDVQQDEwZH\naXRraXQxEzARBgNVBAoTCkdvb2dsZSBJbmMxCzAJBgNVBAYTAlVTMB4XDTI0MDcx\nMTA5MzgzNFoXDTI1MDcwNjA5MzgzNFowMzEPMA0GA1UEAxMGR2l0a2l0MRMwEQYD\nVQQKEwpHb29nbGUgSW5jMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAMI0H9SjPV26sipRjPTl6HR6Q8pOQ/6GsfR2HOLT5bkpc0cq\n8NE0XqWDxf0g/mhVb3O5b/jN4q3LWFaVeISshcJINE7zKH+zKJhYwR8L79+fjzNN\noEwx4FESepTUHVW7qC49U1oac30oMD4c5ZCuCZ7OTgboASu2MOctR/p8+R6jsvdL\nfSpg4CKKy8AlUT+liuXpv4Oaptpp6murTmkDEqVJoLJKMpn0yiTPalAh8C514KXx\n3SxhPAOm5plsVxYGBYZ3XBOaB+Uu0xZi5HNYnSJmo9TihF/RWvE2mzE4IE8VA2YI\nZBNctcuCk2No/r9W/2gTF6e2YbrjfvkD0Vg+ovkCAwEAAaM4MDYwDAYDVR0TAQH/\nBAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCB4AwDQYJ\nKoZIhvcNAQELBQADggEBADeGUKr/lCSUM/0Q5gxvcocmxtoD4WOylGs0dBPd/Gs2\nUZ55sXJXzmf4QUwLAOMBzHwr8mGcOYVtuXuOKLxPB/rNhFM+A841ZBTXsOFPRPXo\npi+fyNd0bDOG70MmSUx0LyHooj4cFHS/2mErOSjk70C43DqcTrPwLuUexiyCZVz3\nFQHJlc+PeHUd4ly4sAtCKNpTopc+VbEctMfsVHXuFDyw8DRP1G5T7+JfIwIyJ20J\n7pok5/SkEL1nr/BwGUcj/AxskHIFvAJuF1BJjxow0sRxbrChzLJYhZHdN7dvPNqq\neV+H6nbsUskrdeLWmzIR2xa4BIbygdCKJohuTn8ZYRU=\n-----END CERTIFICATE-----\n',
  usAeNA:
    '-----BEGIN CERTIFICATE-----\nMIIDHDCCAgSgAwIBAgIENHxoNzANBgkqhkiG9w0BAQsFADAzMQ8wDQYDVQQDEwZH\naXRraXQxEzARBgNVBAoTCkdvb2dsZSBJbmMxCzAJBgNVBAYTAlVTMB4XDTI0MDgx\nNjA5NDUxMFoXDTI1MDgxMTA5NDUxMFowMzEPMA0GA1UEAxMGR2l0a2l0MRMwEQYD\nVQQKEwpHb29nbGUgSW5jMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAMJXF9Y6Db3yIKjXDWvApd+ITJVWm9jQ2uhcD7TaMtYsjwiw\nd4TRETSZS/PC/01lm7smQbtBUEzewM9dGFtuZHisp6IFPsbRaYHYwU4nVn60YMYs\n9iQ5epppqCft/rVLBe5sBUESIS9su5IuCeTCPgzGicFqppmYBhiPSI7T7ztBoSSX\ng8eLajZb9/GqpjdQq6bLIbDLXsL4urMDskneh447UWqKyKr2mkZVsPxjnOfCjHby\n5kfJsuzF6wdyhRXBZ3SE791+RjGA/a07caDKQXDDfwkJ+Ilg/qdcDybzGg6My/D/\nK4imOyxmhLKKL1NA9RUG/WDGsiSozKelz1juGt8CAwEAAaM4MDYwDAYDVR0TAQH/\nBAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCB4AwDQYJ\nKoZIhvcNAQELBQADggEBAC277O98HLdEabZdFcLIvapRGN69K7LvM8zKp9L2ZGYb\ndyxrReKvE8+5Oc1Da2CsTbGgMxe70XZMdKIElPaX6hOGXbLBjcfFzy7uZtyZthyh\njVC1zBifCWNVdRzaJpRNJ0Jt6ysX6EVeeL7hoZ3IcME9CfIu2CVKLMbRrykt3PfG\ntbCFTq+G7NSOCgf5fWvH8IFZInjiVM3CcGMsPfmnoIpIyc60Hx0WUJQ7kCkoW1DC\n61MxA3A8kugVK47/y42NM+ej7OthtSH4gVOybZBcYrmmFiAb4O/Ijcgt4GFC147x\n8KNG2B4OAH9l3EcKjPmrdkjIaJOR5mq7S3bnxO5PxPs=\n-----END CERTIFICATE-----\n',
  KRSnmg:
    '-----BEGIN CERTIFICATE-----\nMIIDHDCCAgSgAwIBAgIEZk8pnzANBgkqhkiG9w0BAQsFADAzMQ8wDQYDVQQDEwZH\naXRraXQxEzARBgNVBAoTCkdvb2dsZSBJbmMxCzAJBgNVBAYTAlVTMB4XDTI0MDky\nMTE3MjcwN1oXDTI1MDkxNjE3MjcwN1owMzEPMA0GA1UEAxMGR2l0a2l0MRMwEQYD\nVQQKEwpHb29nbGUgSW5jMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBAMN5WgJ7EQbhDF8UquawppXBt9gvjbL6gnfVXaQi5KvrSp+P\nPffa3UBipxezgwjGfSfp7z02HZike5bKBSIa6sGWxoDfejLyz2lkRDGpdv0vtJdt\nC9b2xqIZ2jq0UD1Vn6aWGEE+y0mvp1QEWTRK5vF6bI/QGNwRuFIGSi1Sb8KVraFW\nIgw4RsS+B5aJlZqE8leHhjO1l5NJkWEh/uwwUKFs+dpWV/9SoBKrDTyPDBt0ZvF5\nYo8Xs5PxVIoEr38JysLZpJ6AWXXLIQN3mdGBd4Wm73o5MW39vObzgsJhgZ4+0jjV\ntWVUL+KpV3mSLaUxpjGa1Fz5qKXyqRfWwSSx3DcCAwEAAaM4MDYwDAYDVR0TAQH/\nBAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCB4AwDQYJ\nKoZIhvcNAQELBQADggEBAHhffK+9nIRkRjuuiie8Eht+OpsOj3BdybN1b//rvLkh\nQtjInKHCWk/PGF5gJoWKIPhAXTGmzh9VBZRMWccBpeh55tC8ZYUu6Pb3V6zTH8vl\nF0VbAEP1mRfkB1x92PugSx7//TPHT1fQ/sKkydWKdTKw4u6DSO3uubm2yZde8OBr\n4JWPFRZKShprumQEM2ZlvbddusOasEiK9u4tbq2XM0ySoxxJix4QlTtU1NQ0noIU\nrYksonUE/hOgl3N1rU2Z7Hx04Ig6XzTBltYv4JVCg5nslbsJE6XjcrzhBaIo+Pe6\n60rol7aw3BYuk1pZVouz4xgRjVfeVQVV48Wk+JTbA1Q=\n-----END CERTIFICATE-----\n',
  '-WZpKQ':
    '-----BEGIN CERTIFICATE-----\nMIIDHDCCAgSgAwIBAgIEN2AQGjANBgkqhkiG9w0BAQsFADAzMQ8wDQYDVQQDEwZH\naXRraXQxEzARBgNVBAoTCkdvb2dsZSBJbmMxCzAJBgNVBAYTAlVTMB4XDTI0MTAz\nMTAxMTcwOFoXDTI1MTAyNjAxMTcwOFowMzEPMA0GA1UEAxMGR2l0a2l0MRMwEQYD\nVQQKEwpHb29nbGUgSW5jMQswCQYDVQQGEwJVUzCCASIwDQYJKoZIhvcNAQEBBQAD\nggEPADCCAQoCggEBANfahbn31sd4bntOODPKabKHU/eeqMiXOsaiai5JvIDQS5oL\nbWSkjs0L5A04kzPaETpRQCYXzEF2Ntad96fVpESAUhXD6DUuJarlAOOQyvF0FFtC\noWwfaqnDFbkB9n8v6sK9K9XcmTInp+FocJ5T+JOGGeZNQp6Bvfz6Yejwrg2kCamo\nXj0W7WeMThJURvd0k3ntxyJtpyoH43Ljci7+ZBhgtN3HyewNruqqFTQFfxzDjPok\n1pGDW8YxeQAZVlegg9hl/UBo1yja+rSJYP9T5XrAXgMBAEyicIRORMAPi0nRahO0\nQCLOtjLMEfc/JM6s5MR4G6LPOyp3SMk1Xbmn0vcCAwEAAaM4MDYwDAYDVR0TAQH/\nBAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMCB4AwDQYJ\nKoZIhvcNAQELBQADggEBAHHi7pUulvBqERPkntC3NrXW/Ceo+KKMUB4NwB3kpV0D\n5Nwa2yA6B3Q3Sr1yBLhVcxNR+sXct6YbfXQ2mF5wq/JGAxkPqXH7lmPGDULWKwRt\nY82aTNfT71tkx5NAcXSNwrf0GN6WPkjZ038BKUSC99McJI32f4iGKFei+tNWOd3H\nypYkm4tkXMbEISNb5KfLnoHYWryoFoPR1ZOrnmohv82S3kXt37fkB24eCJC46Pxy\nqF/e/SyJEQHY7RAW4rMfs8HPWJZRUmIhzxKa3PKmrcORvS97al9qY5KbKwlCfWIP\nHdPy1htgk4Jt8yOkQe6YnFUOWOx9Yxj6dCxV1BfNYg8=\n-----END CERTIFICATE-----\n',
};

const sessionCookiePublicKeys: Record<string, JsonWebKeyWithKid> = {
  'bZ-_5g': {
    kty: 'RSA',
    alg: 'RS256',
    use: 'sig',
    kid: 'bZ-_5g',
    n: '3JUC6SNQ1oD3Pnk8IrcjzTcA9_uDmj7H6Hz2k6EVB14dl34AxqZ1u0uxuaB9nSXFNogBtoR1Zb1ksVMtuw70XxVzfyfSCjF2eeBLzl3Wy2KHRaZjanTioCS7IWmNUwYuhO1x6n2uC5z7RS4NMHJrQ-wSyW0TQOC3wdUaXxkWcXhA1jhwgWX8lMXQk-kbEKPzTUv9lr4oyd6eLVsw_F2fs1OGhVvDf0xWp0hhOOdbEWcOdnlRIsjE6EUe0Jp_qRDDe42TKSJmIz3RfMAMRvdFTW5KETB65KH9bz3S2cby5c57fj8xVJG_BxsPiwm8wLgQqxjPMniY3-LgYLmAd9KPIw',
    e: 'AQAB',
  },
  _aLBDQ: {
    kty: 'RSA',
    alg: 'RS256',
    use: 'sig',
    kid: '_aLBDQ',
    n: 'wjQf1KM9XbqyKlGM9OXodHpDyk5D_oax9HYc4tPluSlzRyrw0TRepYPF_SD-aFVvc7lv-M3irctYVpV4hKyFwkg0TvMof7MomFjBHwvv35-PM02gTDHgURJ6lNQdVbuoLj1TWhpzfSgwPhzlkK4Jns5OBugBK7Yw5y1H-nz5HqOy90t9KmDgIorLwCVRP6WK5em_g5qm2mnqa6tOaQMSpUmgskoymfTKJM9qUCHwLnXgpfHdLGE8A6bmmWxXFgYFhndcE5oH5S7TFmLkc1idImaj1OKEX9Fa8TabMTggTxUDZghkE1y1y4KTY2j-v1b_aBMXp7ZhuuN--QPRWD6i-Q',
    e: 'AQAB',
  },
  usAeNA: {
    kty: 'RSA',
    alg: 'RS256',
    use: 'sig',
    kid: 'usAeNA',
    n: 'wlcX1joNvfIgqNcNa8Cl34hMlVab2NDa6FwPtNoy1iyPCLB3hNERNJlL88L_TWWbuyZBu0FQTN7Az10YW25keKynogU-xtFpgdjBTidWfrRgxiz2JDl6mmmoJ-3-tUsF7mwFQRIhL2y7ki4J5MI-DMaJwWqmmZgGGI9IjtPvO0GhJJeDx4tqNlv38aqmN1CrpsshsMtewvi6swOySd6HjjtRaorIqvaaRlWw_GOc58KMdvLmR8my7MXrB3KFFcFndITv3X5GMYD9rTtxoMpBcMN_CQn4iWD-p1wPJvMaDozL8P8riKY7LGaEsoovU0D1FQb9YMayJKjMp6XPWO4a3w',
    e: 'AQAB',
  },
  KRSnmg: {
    kty: 'RSA',
    alg: 'RS256',
    use: 'sig',
    kid: 'KRSnmg',
    n: 'w3laAnsRBuEMXxSq5rCmlcG32C-NsvqCd9VdpCLkq-tKn48999rdQGKnF7ODCMZ9J-nvPTYdmKR7lsoFIhrqwZbGgN96MvLPaWREMal2_S-0l20L1vbGohnaOrRQPVWfppYYQT7LSa-nVARZNErm8Xpsj9AY3BG4UgZKLVJvwpWtoVYiDDhGxL4HlomVmoTyV4eGM7WXk0mRYSH-7DBQoWz52lZX_1KgEqsNPI8MG3Rm8Xlijxezk_FUigSvfwnKwtmknoBZdcshA3eZ0YF3habvejkxbf285vOCwmGBnj7SONW1ZVQv4qlXeZItpTGmMZrUXPmopfKpF9bBJLHcNw',
    e: 'AQAB',
  },
  '-WZpKQ': {
    kty: 'RSA',
    alg: 'RS256',
    use: 'sig',
    kid: '-WZpKQ',
    n: '19qFuffWx3hue044M8ppsodT956oyJc6xqJqLkm8gNBLmgttZKSOzQvkDTiTM9oROlFAJhfMQXY21p33p9WkRIBSFcPoNS4lquUA45DK8XQUW0KhbB9qqcMVuQH2fy_qwr0r1dyZMien4WhwnlP4k4YZ5k1CnoG9_Pph6PCuDaQJqahePRbtZ4xOElRG93STee3HIm2nKgfjcuNyLv5kGGC03cfJ7A2u6qoVNAV_HMOM-iTWkYNbxjF5ABlWV6CD2GX9QGjXKNr6tIlg_1PlesBeAwEATKJwhE5EwA-LSdFqE7RAIs62MswR9z8kzqzkxHgbos87KndIyTVduafS9w',
    e: 'AQAB',
  },
};

describe('jwkFromX509', () => {
  const testCases = Object.entries(relyingpartyPublicKeys).map(([kid, x509]) => ({
    kid,
    x509,
    expectedJwk: sessionCookiePublicKeys[kid],
  }));

  testCases.forEach(({ kid, x509, expectedJwk }) => {
    it(`should convert x509 certificate to JWK for kid: ${kid}`, async () => {
      const jwk = await jwkFromX509(kid, x509);
      expect(jwk).toEqual(expectedJwk);
    });
  });
});
