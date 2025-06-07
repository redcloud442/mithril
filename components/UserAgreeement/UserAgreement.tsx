"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PrivacyAgreementModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="px-6 py-3 flex items-center gap-2 font-semibold underline text-blue-400 hover:bg-inherit hover:dark:bg-transparent"
        >
          <span>&quot;User Agreement&quot;</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        type="earnings"
        className="max-h-[90vh] flex flex-col p-4 overflow-y-auto bg-black text-gray-300 border-amber-500 border-2"
      >
        <DialogHeader className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-center gap-3">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                OMNIX-GLOBAL Privacy Agreement
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-400">
                Effective Date: May 30, 2025
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-gray-100 hover:text-white font-semibold">
              1. Information We Collect
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up text-gray-300">
              <p className="mb-2">
                When you register for an Omnix account, we may collect the
                following data:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Mobile Number</li>
                <li>Wallet Address or Payment Information</li>
                <li>Referral Information (if applicable)</li>
                <li>Transaction Data and Earnings History</li>
                <li>IP Address and Device Information</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-gray-100 hover:text-white font-semibold">
              2. How We Use Your Information
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up text-gray-300">
              <p className="mb-2">
                Your information is used for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>To create and manage your Omnix account</li>
                <li>
                  To process and track your investments and trading results
                </li>
                <li>
                  To send payout confirmations, updates, and announcements
                </li>
                <li>To enable referral and network income tracking</li>
                <li>To improve system performance and user experience</li>
                <li>
                  To comply with applicable laws and regulatory requirements
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-gray-100 hover:text-white font-semibold">
              3. Sharing of Information
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up text-gray-300">
              <p className="mb-2">
                We do <strong>not</strong> sell or share your personal data with
                third parties, except:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>When required by law or legal processes</li>
                <li>
                  With service providers that assist us in operating the
                  platform
                </li>
                <li>With your permission or at your request</li>
              </ul>
              <p className="mt-2">
                All third parties handling your data are required to uphold the
                same level of privacy and security that we do.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-gray-100 hover:text-white font-semibold">
              4. Data Security
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                We use industry-standard measures to protect your personal data,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encrypted storage</li>
                <li>Secure server environments</li>
                <li>Access controls and monitoring</li>
              </ul>
              <p className="mt-2">
                While no system is 100% secure, we continuously improve our
                protections to safeguard your information.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-gray-100 hover:text-white font-semibold">
              5. User Rights
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up text-gray-300">
              <p className="mb-2">As an Omnix user, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Request access to the data we hold about you</li>
                <li>Correct any inaccurate or outdated information</li>
                <li>
                  Request the deletion of your account and associated data
                </li>
                <li>Opt out of promotional communications at any time</li>
              </ul>
              <p className="mt-2">
                To make these requests, contact our support team at:{" "}
                <strong>omnixglobal2025@gmail.com</strong>
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-gray-100 hover:text-white font-semibold">
              6. Consent
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up text-gray-300">
              <p className="mb-2">
                By registering to the Omnix system, you agree to this Privacy
                Agreement and consent to the collection and use of your
                information as described above.
              </p>
              <p>
                If we make changes to this agreement, we will notify you via
                email or in-app announcement. Continued use of the platform
                after such changes indicates your acceptance.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="text-center mt-8">
          <p className="text-lg font-semibold text-white">
            Thank you for trusting Omnix. Your privacy is our priority.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyAgreementModal;
