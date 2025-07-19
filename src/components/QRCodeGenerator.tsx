import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QrCode, Download, Copy } from 'lucide-react'

interface QRCodeGeneratorProps {
  merchantId?: string
  programId?: string
  onGenerate?: (qrData: string) => void
}

const QRCodeGenerator = ({ merchantId, programId, onGenerate }: QRCodeGeneratorProps) => {
  const [qrData, setQrData] = useState('')
  const [customText, setCustomText] = useState('')

  const generateQRCode = () => {
    const baseUrl = window.location.origin
    const qrUrl = `${baseUrl}/card/${merchantId || 'demo'}?program=${programId || 'default'}&ref=${customText || 'checkin'}`
    setQrData(qrUrl)
    onGenerate?.(qrUrl)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData)
    alert('QR code URL copied to clipboard!')
  }

  const downloadQR = () => {
    // Create a simple QR code representation
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200
    
    // Simple QR code pattern (placeholder)
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(10, 10, 180, 180)
    
    // Add some QR-like patterns
    ctx.fillStyle = '#000000'
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i + j) % 3 === 0) {
          ctx.fillRect(i * 9 + 15, j * 9 + 15, 8, 8)
        }
      }
    }

    // Download
    const link = document.createElement('a')
    link.download = 'loyalty-qr-code.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for customer check-ins and loyalty program access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customText">Custom Reference (Optional)</Label>
          <Input
            id="customText"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="e.g., table-5, counter-1"
          />
        </div>

        <Button onClick={generateQRCode} className="w-full">
          Generate QR Code
        </Button>

        {qrData && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border text-center">
              <div className="w-32 h-32 bg-gray-900 mx-auto mb-4 rounded-lg flex items-center justify-center">
                <div className="w-28 h-28 bg-white rounded flex items-center justify-center">
                  <div className="grid grid-cols-8 gap-px">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 ${
                          (i % 3 === 0 || i % 5 === 0) ? 'bg-black' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan to access loyalty program
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy URL
                </Button>
                <Button size="sm" variant="outline" onClick={downloadQR}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded text-xs">
              <strong>QR Code URL:</strong>
              <br />
              <span className="break-all text-gray-600">{qrData}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default QRCodeGenerator