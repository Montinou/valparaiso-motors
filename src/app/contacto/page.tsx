'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Send, CheckCircle, Loader2 } from 'lucide-react';

const vehicles = [
  { slug: 'haval-jolion', name: 'Haval Jolion' },
  { slug: 'haval-jolion-pro-hev', name: 'Haval Jolion PRO HEV' },
  { slug: 'haval-h6-gt', name: 'Haval H6 GT' },
  { slug: 'haval-h6-hev', name: 'Haval H6 HEV' },
  { slug: 'haval-h6-3gen', name: 'Haval H6 3ra Generación' },
  { slug: 'ora-03', name: 'ORA 03' },
  { slug: 'gwm-poer', name: 'GWM Poer Super Luxury' },
  { slug: 'gwm-poer-elite', name: 'GWM Poer Elite' },
  { slug: 'gwm-tank-300', name: 'GWM Tank 300' },
  { slug: 'mitsubishi-l200', name: 'Mitsubishi L200' },
  { slug: 'mitsubishi-outlander', name: 'Mitsubishi Outlander' },
  { slug: 'changan-cs55-plus-phev', name: 'Changan CS55 Plus PHEV' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleSlug: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'web',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          vehicleSlug: '',
          message: '',
        });
        
        // Track analytics
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'lead_created',
            vehicleSlug: formData.vehicleSlug,
            metadata: { source: 'contact_form' },
          }),
        }).catch(() => {});

        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(data.error || 'Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Error de conexión. Por favor, intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactanos</h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Estamos para ayudarte a encontrar tu próximo vehículo. Completá el formulario o visitanos en nuestro showroom.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Envianos tu consulta</h2>

              {submitSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">¡Gracias! Recibimos tu consulta. Un asesor se contactará pronto.</p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="351 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ejemplo@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="vehicleSlug" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehículo de interés
                  </label>
                  <select
                    id="vehicleSlug"
                    name="vehicleSlug"
                    value={formData.vehicleSlug}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Seleccioná un modelo (opcional)</option>
                    <optgroup label="Haval">
                      <option value="haval-jolion">Haval Jolion</option>
                      <option value="haval-jolion-pro-hev">Haval Jolion PRO HEV</option>
                      <option value="haval-h6-gt">Haval H6 GT</option>
                      <option value="haval-h6-hev">Haval H6 HEV</option>
                      <option value="haval-h6-3gen">Haval H6 3ra Generación</option>
                    </optgroup>
                    <optgroup label="ORA">
                      <option value="ora-03">ORA 03</option>
                    </optgroup>
                    <optgroup label="GWM">
                      <option value="gwm-poer">GWM Poer Super Luxury</option>
                      <option value="gwm-poer-elite">GWM Poer Elite</option>
                      <option value="gwm-tank-300">GWM Tank 300</option>
                    </optgroup>
                    <optgroup label="Mitsubishi">
                      <option value="mitsubishi-l200">Mitsubishi L200</option>
                      <option value="mitsubishi-outlander">Mitsubishi Outlander</option>
                    </optgroup>
                    <optgroup label="Changan">
                      <option value="changan-cs55-plus-phev">Changan CS55 Plus PHEV</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Contanos qué vehículo te interesa o cualquier consulta que tengas..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Enviar consulta
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                  <p className="text-gray-600">Av. Ciudad de Valparaíso 4380</p>
                  <p className="text-gray-600">Córdoba, Argentina</p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                  <a href="tel:+543513092154" className="text-blue-600 hover:underline">
                    (0351) 3092154
                  </a>
                  <p className="text-sm text-gray-500 mt-1">WhatsApp disponible</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:Info@valparaisomotors.com.ar" className="text-blue-600 hover:underline break-all">
                    Info@valparaisomotors.com.ar
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Horarios</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Lun - Vie:</span> 9:00 - 19:30
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Sábado:</span> 9:00 - 14:00
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Domingo:</span> Cerrado
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seguinos en redes</h3>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/valparaiso.motors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="font-medium">Instagram</span>
                  </a>
                  <a
                    href="https://www.facebook.com/valparaisomotorsarg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="font-medium">Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.8339834526976!2d-64.18945!3d-31.420134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28b25c0fb1b%3A0x123456789!2sAv.%20Ciudad%20de%20Valpara%C3%ADso%204380%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Valparaíso Motors - Mapa"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
