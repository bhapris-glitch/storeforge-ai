/**
 * ============================================================================
 * Layboka AI
 * Settings Page
 * ============================================================================
 *
 * File:
 * frontend/src/app/settings/page.tsx
 *
 * Route:
 * /settings
 *
 * Purpose:
 * - Merchant account settings
 * - Store configuration
 * - AI preferences
 * - Notification preferences
 *
 * ============================================================================
 */

'use client';

import {
  useState,
} from 'react';

import DashboardLayout
  from '@/components/layout/DashboardLayout';

import Card
  from '@/components/ui/Card';

import Input
  from '@/components/ui/Input';

import Switch
  from '@/components/ui/Switch';

import Button
  from '@/components/ui/Button';


// ============================================================================
// PAGE
// ============================================================================

export default function SettingsPage() {


  const [
    name,
    setName,
  ] = useState('');


  const [
    email,
    setEmail,
  ] = useState('');


  const [
    storeUrl,
    setStoreUrl,
  ] = useState('');


  const [
    aiEnabled,
    setAiEnabled,
  ] = useState(true);


  const [
    notifications,
    setNotifications,
  ] = useState(true);


  const [
    saving,
    setSaving,
  ] = useState(false);



  // ========================================================================
  // SAVE SETTINGS
  // ========================================================================

  async function handleSave() {

    try {

      setSaving(true);


      /*
       * Settings will eventually connect to:
       *
       * user.store.ts
       * store.store.ts
       * backend settings API
       */


      await new Promise(

        (resolve) =>

          setTimeout(
            resolve,
            600
          )

      );


      console.log(
        'Settings saved',
        {
          name,
          email,
          storeUrl,
          aiEnabled,
          notifications,
        }
      );


    } catch (error) {

      console.error(
        'Failed to save settings:',
        error
      );


    } finally {

      setSaving(false);

    }

  }



  return (

    <DashboardLayout>


      <div

        className="mx-auto w-full max-w-5xl space-y-8"

      >


        {/* ================================================================
            HEADER
        ================================================================= */}

        <div>

          <p

            className="mb-2 text-sm font-medium text-[#FF3B2F]"

          >

            Account

          </p>


          <h1

            className="text-3xl font-bold tracking-tight text-white"

          >

            Settings

          </h1>


          <p

            className="mt-2 max-w-2xl text-sm leading-6 text-white/50"

          >

            Manage your account, store connection and
            Layboka AI preferences.

          </p>


        </div>



        {/* ================================================================
            ACCOUNT
        ================================================================= */}

        <Card

          variant="dark"

          title="Account Information"

          description="Update your basic account details."

        >

          <div

            className="grid gap-5 sm:grid-cols-2"

          >

            <Input

              label="Name"

              placeholder="Your name"

              value={name}

              onChange={(event) =>

                setName(
                  event.target.value
                )

              }

            />


            <Input

              label="Email"

              type="email"

              placeholder="you@example.com"

              value={email}

              onChange={(event) =>

                setEmail(
                  event.target.value
                )

              }

            />

          </div>

        </Card>



        {/* ================================================================
            STORE
        ================================================================= */}

        <Card

          variant="dark"

          title="Store Connection"

          description="Manage the ecommerce store connected to Layboka AI."

        >

          <Input

            label="Store URL"

            placeholder="https://your-store.myshopify.com"

            value={storeUrl}

            onChange={(event) =>

              setStoreUrl(
                event.target.value
              )

            }

          />

        </Card>



        {/* ================================================================
            AI PREFERENCES
        ================================================================= */}

        <Card

          variant="dark"

          title="AI Preferences"

          description="Control how Layboka AI operates for your store."

        >

          <div

            className="divide-y divide-white/5"

          >


            <SettingRow

              title="Enable AI Features"

              description="Allow Layboka AI to generate and optimize store content."

            >

              <Switch

                checked={aiEnabled}

onChange={(event) =>
  setAiEnabled(
    event.target.checked
  )
}

              />

            </SettingRow>



            <SettingRow

              title="Notifications"

              description="Receive updates about AI activity and store performance."

            >

              <Switch

                checked={notifications}

                onChange={
                  setNotifications
                }

              />

            </SettingRow>


          </div>

        </Card>



        {/* ================================================================
            SAVE
        ================================================================= */}

        <div

          className="flex justify-end"

        >

          <Button

            loading={saving}

            onClick={
              handleSave
            }

          >

            Save Changes

          </Button>

        </div>


      </div>


    </DashboardLayout>

  );

}


// ============================================================================
// SETTING ROW
// ============================================================================

function SettingRow({

  title,

  description,

  children,

}: {

  title: string;

  description: string;

  children: React.ReactNode;

}) {


  return (

    <div

      className="flex items-center justify-between gap-6 py-5"

    >

      <div>

        <h3

          className="text-sm font-medium text-white"

        >

          {title}

        </h3>


        <p

          className="mt-1 max-w-xl text-sm leading-6 text-white/40"

        >

          {description}

        </p>

      </div>


      <div className="shrink-0">

        {children}

      </div>


    </div>

  );

}
