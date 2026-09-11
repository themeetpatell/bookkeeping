/**
 * Frozen copy of the FinCore pricing questions this site quotes against.
 *
 * GENERATED — do not edit by hand.
 * Regenerate: node scripts/sync-quote-questions.mjs
 * Verify:     node scripts/sync-quote-questions.mjs --check
 *
 * Option ids are FinCore UUIDs and are what /resolve prices on, so a stale id
 * produces a wrong price rather than an error. The --check run is what catches
 * that; keep it in CI.
 */
export const QUOTE_SERVICES = {
  "accounting-bookkeeping": {
    "serviceId": "91ba4950-e80f-4010-bc74-d3482bc38f95",
    "slug": "accounting-bookkeeping",
    "serviceName": "Accounting & Bookkeeping",
    "periodType": "start_only",
    "startDateInstruction": "Which month do you want your accounting to start from?",
    "hidden": false,
    "chooserLabel": "Accounting & bookkeeping",
    "chooserHint": "Monthly books, reconciliations and management accounts",
    "questions": [
      {
        "id": "2d5dab30-6f51-466c-8469-552deb6f2f74",
        "text": "What is the main reason you are looking for accounting support?",
        "help": "Pick the one that best describes your situation right now.",
        "options": [
          {
            "id": "e2b65762-3493-42cd-a6fc-dce1d85325fd",
            "value": "stay_compliant_—_meet_uae_tax_and_regulatory_requirements",
            "text": "Stay compliant — meet UAE tax and regulatory requirements"
          },
          {
            "id": "d25f3fc3-3894-4d70-b45f-04b514a7300c",
            "value": "investor-ready_—_clean_financials_for_fundraising_or_investors",
            "text": "Investor-ready — clean financials for fundraising or investors"
          },
          {
            "id": "7663d7ea-3035-4279-8906-aaf548fcabab",
            "value": "understand_my_business_—_see_how_my_business_is_actually_performing",
            "text": "Understand my business — see how my business is actually performing"
          },
          {
            "id": "c2448086-0012-4543-b0a9-fb2365f963a2",
            "value": "audit,_bank_or_due_diligence_—_need_verified_financials_for_a_third_party",
            "text": "Audit, bank or due diligence — need verified financials for a third party"
          },
          {
            "id": "3cfc121c-b602-4192-9453-6853707a2420",
            "value": "fix_a_mess_—_books_are_behind_or_disorganised",
            "text": "Fix a mess — books are behind or disorganised"
          },
          {
            "id": "24724c71-e941-4d28-b3da-a06afe2ad583",
            "value": "starting_fresh_—_new_business,_want_to_set_things_up_right_from_day_one",
            "text": "Starting fresh — new business, want to set things up right from day one"
          }
        ]
      },
      {
        "id": "468f972d-76c4-40a8-ba62-67ee67415732",
        "text": "How many transactions do you expect your business to have in a typical month?",
        "help": "A transaction is anything money-related — a bank transaction, cash payment, sales invoice, or supplier bill. Think about where your business will be over the next 12 months, not just today. If you're not sure, give your best estimate.",
        "options": [
          {
            "id": "df4360ed-e7e4-4412-a20b-b13265f27b04",
            "value": "up_to_10_per_month",
            "text": "Up to 10 per month"
          },
          {
            "id": "71d6ed7a-0639-481b-867e-6445cde87fc6",
            "value": "around_150_per_month",
            "text": "Around 50 per month"
          },
          {
            "id": "3ffa1291-33ef-4e16-92d5-6adeedcae2dd",
            "value": "around_500_per_month",
            "text": "Around 150 per month"
          },
          {
            "id": "00852115-9b82-4143-a79c-559787fa88c4",
            "value": "around_1,000_per_month",
            "text": "Around 300 per month"
          },
          {
            "id": "7ef71173-1921-4bd2-8376-392b039a74f2",
            "value": "around_50_per_month",
            "text": "Around 1,000 per month"
          },
          {
            "id": "c2cab1a1-a26b-484a-8488-e06f03005aa0",
            "value": "around_5,000_per_month",
            "text": "Around 5,000 per month"
          },
          {
            "id": "0da1ac0b-54bf-470d-ad04-a1bdcaaf6157",
            "value": "around_10,000_per_month",
            "text": "Around 10,000 per month"
          },
          {
            "id": "32f4ab78-458c-4393-8b30-e41deaf14a6d",
            "value": "more_than_10,000_per_month",
            "text": "More than 10,000 per month"
          }
        ]
      },
      {
        "id": "44610326-048b-4485-a9a1-53c4dd00bf50",
        "text": "What do you expect your combined monthly business volume to be over the next 12 months?",
        "help": "Add up your expected total income (sales, revenue) and total expenses (salaries, supplier payments, operating costs) for a typical month in the year ahead. If you're a new business, use your best estimate of where you'll be.",
        "options": [
          {
            "id": "e6fdb1e2-3fc6-4de5-9ea4-1418d83fe5c1",
            "value": "aed_50,000_–_100,000/month_($13,600_–_$27,200/month)",
            "text": "AED 0 – 100,000/month "
          },
          {
            "id": "6ef5dc77-fcc0-4174-bc14-342b03c510dc",
            "value": "aed_100,000_–_250,000/month_($27,200_–_$68,000/month)",
            "text": "AED 100,000 – 250,000/month "
          },
          {
            "id": "d4c1b0ee-713e-4b2b-923c-db4c26d87ee6",
            "value": "aed_250,000_–_500,000/month_($68,000_–_$136,000/month)",
            "text": "AED 250,000 – 500,000/month"
          },
          {
            "id": "d2c79db9-dad0-4c17-8956-07be539be1ff",
            "value": "aed_500,000_–_1,000,000/month_($136,000_–_$272,000/month)",
            "text": "AED 500,000 – 1,000,000/month "
          },
          {
            "id": "8b0d2cac-8666-4e6e-a111-c5760b6ccb09",
            "value": "aed_1,000,000_–_5,000,000/month_($272,000_–_$1.36m/month)",
            "text": "AED 1,000,000 – 5,000,000/month "
          },
          {
            "id": "f700257f-7209-4906-8844-ff9b615e0175",
            "value": "more_than_aed_5,000,000/month_(over_$1.36m/month)",
            "text": "More than AED 5,000,000/month "
          }
        ]
      },
      {
        "id": "6dbe7f14-a637-4840-8864-6bcae963f63a",
        "text": "What type of business do you run?",
        "help": "This helps us match you to the right plan and ask the most relevant questions for your business.",
        "options": [
          {
            "id": "6d78faf6-2fb0-47a3-bc1c-57fd65e87084",
            "value": "ind_frlc",
            "text": "Freelancer / Consultant"
          },
          {
            "id": "6b6e0dc1-c610-49cf-9213-9817f36be02a",
            "value": "ind_prof",
            "text": "Professional Services"
          },
          {
            "id": "ebc68468-3a49-4017-8161-ad96491d6173",
            "value": "ind_mkt",
            "text": "Marketing, Media & Creative"
          },
          {
            "id": "682dc4a5-5a2b-4984-938f-1c5adf4b40fc",
            "value": "ind_tech",
            "text": "Tech & SaaS"
          },
          {
            "id": "4d531c85-4a28-4a27-ba94-384677e0ec3e",
            "value": "ind_trad",
            "text": "Trading & Retail"
          },
          {
            "id": "d6a065a9-1143-4be7-98e3-e71da8a397d2",
            "value": "ind_ecom",
            "text": "E-commerce / Dropshipping"
          },
          {
            "id": "c356a39f-87ca-4b3e-9d07-fa53e706dcdd",
            "value": "ind_imp",
            "text": "Import & Export"
          },
          {
            "id": "f7ffbf35-0d18-456f-9904-4d41631656be",
            "value": "ind_fbh",
            "text": "Food, Beverage & Hospitality"
          },
          {
            "id": "67f633fe-9c65-4e2b-9e57-c1d6bb173db2",
            "value": "ind_con",
            "text": "Construction & Contracting"
          },
          {
            "id": "da72b7cf-d2e1-4a76-9900-7bcfcd373e08",
            "value": "ind_re",
            "text": "Real Estate & Property"
          },
          {
            "id": "e2916a49-9f8e-445b-9052-c1db4253c4b3",
            "value": "ind_mfg",
            "text": "Manufacturing"
          },
          {
            "id": "f43aacad-6db7-4d6e-87a8-9d206ac10294",
            "value": "ind_hc",
            "text": "Healthcare & Wellness"
          },
          {
            "id": "82186a78-87c7-4356-98ca-b5f6bafd42d1",
            "value": "ind_edu",
            "text": "Education & Training"
          },
          {
            "id": "588503c3-312e-40c3-8403-ecbd83e1e44e",
            "value": "ind_tte",
            "text": "Travel, Tourism & Events"
          },
          {
            "id": "c8837012-f5c6-4e86-ab0e-89a7eb10a9b8",
            "value": "ind_log",
            "text": "Logistics & Freight Forwarding"
          },
          {
            "id": "f2edb774-3e10-40bb-acb2-6bbff08b8f35",
            "value": "ind_auto",
            "text": "Automotive"
          },
          {
            "id": "c4159296-d278-45d5-ac4a-e12ebaefdeca",
            "value": "ind_fin",
            "text": "Financial Services & Fintech"
          },
          {
            "id": "9be382c7-0804-4503-8627-b4afe2db1f29",
            "value": "ind_inv",
            "text": "Investment & Fund Management"
          },
          {
            "id": "921c9c79-1d54-47ac-9d71-07949f6e3f02",
            "value": "ind_spv",
            "text": "Holding Company / SPV"
          },
          {
            "id": "240f53e4-7057-41f9-b8d0-b13c39d1e2f8",
            "value": "other",
            "text": "Other"
          }
        ]
      },
      {
        "id": "b21095ca-ebf0-47fa-b8e5-b310f8c4ef24",
        "text": "How many companies or entities do you need us to manage?",
        "help": "Count each separate trade licence or registered company as one entity.",
        "options": [
          {
            "id": "fd08b860-6ea4-4473-bb2d-675cb04c341a",
            "value": "1",
            "text": "1"
          },
          {
            "id": "140813be-3313-4538-bc1c-294a8426da18",
            "value": "2",
            "text": "2"
          },
          {
            "id": "62ecd845-a7df-4a76-8430-a30ec337b2d2",
            "value": "3",
            "text": "3"
          },
          {
            "id": "90809faf-c8bc-480c-bb2f-5ea6a49857ec",
            "value": "4",
            "text": "4"
          },
          {
            "id": "953c5c0c-e10c-49e2-8cd9-da854593a249",
            "value": "5",
            "text": "5"
          },
          {
            "id": "2e48dac8-6e12-4fd2-954e-88cc736db476",
            "value": "6_–_10",
            "text": "6 – 10"
          },
          {
            "id": "4d7b790e-9ffe-452a-8b4f-8fff949aa898",
            "value": "10_–_20",
            "text": "10 – 20"
          },
          {
            "id": "e993ef1c-6d87-42a6-a48d-4491c22e9ff3",
            "value": "20+",
            "text": "20+"
          }
        ]
      },
      {
        "id": "8a348283-e5cc-4573-954d-7cb1dbecd83e",
        "text": "How much catch-up work do your books need before we begin?",
        "help": "This helps us understand if there's any historical bookkeeping to sort out before your ongoing service starts.",
        "options": [
          {
            "id": "4acc6c89-b331-4388-8b8b-028d7cd2edb8",
            "value": "none_—_books_are_clean,_switching_from_another_firm_or_accountant",
            "text": "None — books are clean, switching from another firm or accountant"
          },
          {
            "id": "cfb190a4-802c-4a45-aba8-d5ecd6a58990",
            "value": "minimal_—_just_a_few_entries_(less_than_20_transactions)",
            "text": "Minimal — just a few entries (less than 20 transactions)"
          },
          {
            "id": "7b589c09-04da-427c-9e1a-4d72b1e03b26",
            "value": "some_—_recently_started_but_a_few_weeks_or_months_behind",
            "text": "Some — recently started but a few weeks or months behind"
          },
          {
            "id": "e6ce9359-92a3-4cf6-9e64-2905df986cab",
            "value": "moderate_—_a_few_months_of_catch-up_needed",
            "text": "Moderate — a few months of catch-up needed"
          },
          {
            "id": "6060de81-a89c-403b-8aa3-063bfba73871",
            "value": "heavy_—_messy_or_unmaintained_for_a_long_time",
            "text": "Heavy — messy or unmaintained for a long time"
          }
        ]
      },
      {
        "id": "1ed36384-4148-4330-b076-3acff8665a05",
        "text": "Would you also like support with finance operations?",
        "help": "This includes invoicing, collections, supplier payments, payroll, and cash flow management — day-to-day financial tasks that go beyond bookkeeping.",
        "options": [
          {
            "id": "538a3f2d-ca8f-45c9-8164-b7a52c22ef1c",
            "value": "yes_—_i'd_like_help_with_some_or_all_of_this",
            "text": "Yes — I'd like help with some or all of this"
          },
          {
            "id": "696117e8-f2c5-4e38-b48f-b91a091499ea",
            "value": "no_—_we_handle_this_ourselves",
            "text": "No — we handle this ourselves"
          }
        ]
      }
    ]
  },
  "finance-operations": {
    "serviceId": "86dc56ed-c3d5-454d-8361-fe03526bdd64",
    "slug": "finance-operations",
    "serviceName": "Finance Operations (AR/AP & Payroll)",
    "periodType": "start_only",
    "startDateInstruction": "",
    "hidden": true,
    "chooserLabel": "Finance Operations (AR/AP & Payroll)",
    "chooserHint": "",
    "questions": [
      {
        "id": "870110d4-ad0c-4a40-9df7-7d1024cef962",
        "text": "Which Finance Operations services do you need?",
        "help": "Select the option that best describes what you need us to handle each month. You can always add more services later as your business grows.",
        "options": [
          {
            "id": "b6d7552f-ac62-4069-8726-23a0cefa63e2",
            "value": "finops_invoicing_only",
            "text": "Invoicing only — raise and send invoices to your customers"
          },
          {
            "id": "cdf9be09-2668-4986-af22-096b5fcd3ead",
            "value": "finops_payments_only",
            "text": "Vendor & employee payments only — manage your outgoing payments"
          },
          {
            "id": "8159a81f-9e41-4256-9a75-a87c9e789579",
            "value": "finops_invoicing_payments",
            "text": "Invoicing + vendor & employee payments"
          },
          {
            "id": "aebf5820-5caf-4847-a149-13ae27acbf7d",
            "value": "finops_full",
            "text": "Full Finance Ops — invoicing, payments, and cash flow tracking & reporting"
          }
        ]
      }
    ]
  },
  "prior-period-catch-up": {
    "serviceId": "d7ac6cee-d90c-4dcc-8920-459dc4a870ad",
    "slug": "prior-period-catch-up",
    "serviceName": "Prior-Period Catch-Up & Books Cleanup",
    "periodType": "date_range",
    "startDateInstruction": "",
    "hidden": true,
    "chooserLabel": "Prior-Period Catch-Up & Books Cleanup",
    "chooserHint": "",
    "questions": [
      {
        "id": "8a498477-e9ac-48af-8cca-24ccfee93daf",
        "text": "What is the total number of transactions during the entire catch-up period?",
        "help": "A transaction includes any sale, purchase, expense, bank entry, or payment. This is the total count across the full period needing cleanup . This directly determines the scope and pricing of your engagement.",
        "options": [
          {
            "id": "ecf4ca8b-20a2-464f-b0ae-8be330376b77",
            "value": "cleanup_txn_under_10",
            "text": "Under 10"
          },
          {
            "id": "81bc72f4-48d1-4ad7-a10b-23cf7023a9ca",
            "value": "cleanup_txn_11_100",
            "text": "11 – 100"
          },
          {
            "id": "30fc7239-bbe5-4b3a-96d1-6aa862bc7546",
            "value": "cleanup_txn_101_250",
            "text": "101 – 250"
          },
          {
            "id": "7953bd6c-2503-4f0d-a43e-089680f37fc4",
            "value": "cleanup_txn_251_500",
            "text": "251 – 500"
          },
          {
            "id": "38b7caa0-c6a7-497d-9bc6-cb81af4f7ef5",
            "value": "cleanup_txn_501_1000",
            "text": "501 – 1,000"
          },
          {
            "id": "d2d07a43-25fd-470e-a7c0-d1bd140e42b4",
            "value": "cleanup_txn_1001_2000",
            "text": "1,001 – 2,000"
          },
          {
            "id": "215e66cf-3c1f-48c3-8fcf-06648a9de202",
            "value": "cleanup_txn_2001_5000",
            "text": "2,001 – 5,000"
          },
          {
            "id": "89467841-bbbe-4659-8cde-baca37420b7f",
            "value": "cleanup_txn_5001_10000",
            "text": "5,001 – 10,000"
          },
          {
            "id": "185cc659-0076-4703-9f18-1764bb87edb5",
            "value": "cleanup_txn_10001_20000",
            "text": "10,001 – 20,000"
          },
          {
            "id": "cf6bf096-7791-4c70-a4e5-5240f81f2feb",
            "value": "cleanup_txn_20001_30000",
            "text": "20,001 – 30,000"
          },
          {
            "id": "bdb63c7f-1622-489f-8640-5fbf0ae5ef5a",
            "value": "cleanup_txn_over_30000",
            "text": "More than 30,000"
          }
        ]
      },
      {
        "id": "4a7db5fe-1fc2-4047-8b1a-db92692ff751",
        "text": "What is the total combined value of your income and expenses during the catch-up period?",
        "help": "This is the total value of all money coming in (sales, revenue) and going out (purchases, expenses) across the entire period needing cleanup. This helps us assess the financial complexity and ensure accurate scoping and pricing.",
        "options": [
          {
            "id": "4f7271cd-242c-4a0b-ac16-7195d096dbef",
            "value": "cleanup_val_under_50k",
            "text": "Under AED 50,000"
          },
          {
            "id": "f3314bf1-648e-41f0-b1a3-5f3ad79b8dd6",
            "value": "cleanup_val_50k_100k",
            "text": "AED 50,001 – AED 100,000"
          },
          {
            "id": "58fb5a74-cdc9-4d60-a18d-d4a0b6d52bcf",
            "value": "cleanup_val_100k_200k",
            "text": "AED 100,001 – AED 200,000"
          },
          {
            "id": "04555b12-307f-441b-853e-b4817335c7bf",
            "value": "cleanup_val_200k_500k",
            "text": "AED 200,001 – AED 500,000"
          },
          {
            "id": "73f92052-54ef-49c7-bdf0-89d005371e2d",
            "value": "cleanup_val_500k_1m",
            "text": "AED 500,001 – AED 1,000,000"
          },
          {
            "id": "29701bbf-8723-4a88-8c29-a395db30adec",
            "value": "cleanup_val_1m_2_5m",
            "text": "AED 1,000,001 – AED 2,500,000"
          },
          {
            "id": "d1fa6632-c1f5-4906-a6a3-bcfc1de21500",
            "value": "cleanup_val_2_5m_5m",
            "text": "AED 2,500,001 – AED 5,000,000"
          },
          {
            "id": "91526ea6-27f2-4b6d-bfed-da729d6763ab",
            "value": "cleanup_val_5m_10m",
            "text": "AED 5,000,001 – AED 10,000,000"
          },
          {
            "id": "2f372359-c640-4da3-800e-a157fa2bb76c",
            "value": "cleanup_val_10m_25m",
            "text": "AED 10,000,001 – AED 25,000,000"
          },
          {
            "id": "dadd54f3-2c55-4b28-ae37-fcac63792507",
            "value": "cleanup_val_25m_50m",
            "text": "AED 25,000,001 – AED 50,000,000"
          },
          {
            "id": "950a13b0-22ad-41e0-9265-36d2d4a44631",
            "value": "cleanup_val_50m_100m",
            "text": "AED 50,000,001 – AED 100,000,000"
          },
          {
            "id": "6d8ff5f5-a540-407e-bb9d-775087d9cc36",
            "value": "cleanup_val_over_100m",
            "text": "More than AED 100,000,000"
          }
        ]
      },
      {
        "id": "642baa4d-b6c6-407f-8d56-20861064a82c",
        "text": "Would you like Corporate Tax filing included for your current or upcoming financial year",
        "help": "Once your books are in order, filing your Corporate Tax return is the natural next step. We can handle your CT filing as part of this engagement so everything is covered in one place",
        "options": [
          {
            "id": "b6cdf998-b95c-456e-a52b-f70152d3d492",
            "value": "yes__include_ct_filing_for_my_current_pending_year",
            "text": "Yes — include CT filing for my current pending year"
          },
          {
            "id": "521f3ee0-5cda-49c5-b8eb-77fbb79bd689",
            "value": "No — not required",
            "text": "No — not required"
          }
        ]
      }
    ]
  },
  "vat-filing": {
    "serviceId": "088c991a-86c4-4a84-a086-e17e942c0163",
    "slug": "vat-filing",
    "serviceName": "VAT Filing",
    "periodType": "start_only",
    "startDateInstruction": " When would you like your VAT filing service to start?",
    "hidden": false,
    "chooserLabel": "VAT filing",
    "chooserHint": "Prepare and submit your VAT returns",
    "questions": [
      {
        "id": "70a9c847-9c9c-4ca5-b419-a858de248863",
        "text": "What type of business do you run?",
        "help": "This helps us match you to the right plan and ask the most relevant questions for your business.",
        "options": [
          {
            "id": "e6f135bc-1642-455a-b132-ebcc5d275bbd",
            "value": "ind_frlc",
            "text": "Freelancer / Consultant"
          },
          {
            "id": "11e070b3-fa39-4385-9164-d2475355002f",
            "value": "ind_prof",
            "text": "Professional Services"
          },
          {
            "id": "5fb1c238-0cf5-4d11-8a9f-177939dddf0d",
            "value": "ind_mkt",
            "text": "Marketing, Media & Creative"
          },
          {
            "id": "8854d2c2-f509-411d-879f-ebd2dbc690d4",
            "value": "ind_tech",
            "text": "Tech & SaaS"
          },
          {
            "id": "41512baf-69e9-41d9-ab0e-cfcf1265ec1b",
            "value": "ind_trad",
            "text": "Trading & Retail"
          },
          {
            "id": "0773c3c4-a322-48b2-9ef4-cb1744ca1d35",
            "value": "ind_ecom",
            "text": "E-commerce / Dropshipping"
          },
          {
            "id": "4a2cc854-8738-4c9c-894e-f755c2d7cc87",
            "value": "ind_imp",
            "text": "Import & Export"
          },
          {
            "id": "414dbd0a-b884-4cb8-8670-d0f2422df6b6",
            "value": "ind_fbh",
            "text": "Food, Beverage & Hospitality"
          },
          {
            "id": "8ef3f379-bff7-4595-be11-52c3bbdaed70",
            "value": "ind_con",
            "text": "Construction & Contracting"
          },
          {
            "id": "1aebebba-473a-4bc5-bfd6-021845d49ead",
            "value": "ind_re",
            "text": "Real Estate & Property"
          },
          {
            "id": "197e1731-d81f-4a10-8ed8-24845c9de6d9",
            "value": "ind_mfg",
            "text": "Manufacturing"
          },
          {
            "id": "fda465ca-0188-4108-a5c8-45105e58a113",
            "value": "ind_hc",
            "text": "Healthcare & Wellness"
          },
          {
            "id": "23d2d7e9-375a-41bb-bcc7-6505a1e93e56",
            "value": "ind_edu",
            "text": "Education & Training"
          },
          {
            "id": "5a8cc0af-067d-442b-8725-e0f9d7952cf0",
            "value": "ind_tte",
            "text": "Travel, Tourism & Events"
          },
          {
            "id": "3a0523be-8704-410e-ac75-08fbfee88f02",
            "value": "ind_log",
            "text": "Logistics & Freight Forwarding"
          },
          {
            "id": "e5833fe1-c5ee-4d7b-87a9-8fae76245991",
            "value": "ind_auto",
            "text": "Automotive"
          },
          {
            "id": "c088d1ac-d825-4ad8-ac4b-287032cc4c54",
            "value": "ind_fin",
            "text": "Financial Services & Fintech"
          },
          {
            "id": "cf4db223-bb61-4021-be6c-64872f10b24d",
            "value": "ind_inv",
            "text": "Investment & Fund Management"
          },
          {
            "id": "2db92b84-1f6d-4c94-83bf-5fcb3da166d7",
            "value": "ind_spv",
            "text": "Holding Company / SPV"
          }
        ]
      },
      {
        "id": "ffabbd68-97a5-48bc-95f8-6eaf57b7a385",
        "text": "How would you like us to handle your VAT filing ?",
        "help": "This helps us understand how much work is involved before we can file your VAT return.",
        "options": [
          {
            "id": "54d74453-c092-426c-b556-cdb8c37a518d",
            "value": " No change in pricing",
            "text": "My books are fully updated — I just need someone to review and file"
          },
          {
            "id": "b30b7417-c08b-4a93-9f7f-b80ae9f20ea8",
            "value": " No change in pricing",
            "text": "My books need to be done first — I want accounting, financial statements, and filing together "
          },
          {
            "id": "619e5fa9-ca17-44e1-85d8-ccc140ce30c6",
            "value": " No change in pricing",
            "text": "I'll send you my invoices and bills — just prepare and submit the VAT return"
          }
        ]
      }
    ]
  },
  "vat-registration": {
    "serviceId": "108d4944-654c-442e-bbb7-6bf1475b2bcb",
    "slug": "vat-registration",
    "serviceName": "VAT Registration",
    "periodType": "none",
    "startDateInstruction": "",
    "hidden": false,
    "chooserLabel": "VAT registration",
    "chooserHint": "Register with the FTA, or apply for an exception",
    "questions": [
      {
        "id": "987038ec-9ed7-43e2-9239-06c960c9d94d",
        "text": "What type of VAT registration do you need?",
        "help": "Standard VAT registration is for businesses meeting the taxable supplies threshold. A VAT registration exception applies to businesses eligible for an exemption — typically those whose supplies are fully zero-rated. If unsure, select Standard VAT Registration.",
        "options": [
          {
            "id": "69763e0a-2508-4c66-85e2-9dd880bb4b4a",
            "value": "vatreg_std_test",
            "text": "Standard VAT Registration — register my business for VAT with the FTA"
          },
          {
            "id": "89d8aaca-ce8a-4afc-8314-f0f610494299",
            "value": "vatreg_exc_test",
            "text": "VAT Registration Exception — apply for an exemption from VAT registration"
          }
        ]
      },
      {
        "id": "bcf42a32-2e86-4caf-8d44-a05280f79fca",
        "text": "What were your total taxable supplies in the last 12 months?",
        "help": "Taxable supplies include all VAT-applicable sales and income your business generated. If your taxable supplies are below AED 187,500, VAT registration is not yet available — you can register once you cross this threshold. If you are a new business, use your best estimate for the next 12 months.",
        "options": [
          {
            "id": "aee5d6c6-7c4e-4b40-adff-5c86cc839596",
            "value": "vtr_voluntary",
            "text": "AED 187,500 – 375,000 — eligible for voluntary registration"
          },
          {
            "id": "40119380-7e99-4512-84c8-a64a256f2c15",
            "value": "vtr_mandatory",
            "text": "Over AED 375,000 — mandatory registration required"
          },
          {
            "id": "2af2446e-a603-4c92-93e4-717ed20dcc46",
            "value": "vtr_upcoming",
            "text": "I expect to cross AED 187,500 shortly — register me when eligible"
          }
        ]
      },
      {
        "id": "d478479b-705f-4e96-801e-84e2357709d5",
        "text": "Do you have records of your taxable supplies from the start of your business?",
        "help": "To determine your VAT registration date and eligibility, the FTA requires a monthly breakdown of your taxable supplies from when your business started. This includes sales invoices, bills, and any other taxable income. If your records are incomplete, we can work from your bank statements.",
        "options": [
          {
            "id": "dd7261fe-db7b-4026-9870-959fd5d54c58",
            "value": "vtr_data_complete",
            "text": "Yes — I have complete records and can share a monthly breakdown"
          },
          {
            "id": "5975e2d3-1379-4cbc-a90a-8fec284a998c",
            "value": "vtr_data_partial_low",
            "text": "I have supporting documents — less than 10 invoices or bills, please prepare from these"
          },
          {
            "id": "c1f827ce-52fa-4b3d-af10-57078fbb02f6",
            "value": "vtr_data_partial_high",
            "text": "I have supporting documents — more than 10 invoices or bills, please prepare from these"
          },
          {
            "id": "376f1973-0d48-43c2-a5df-cd55851c0d9b",
            "value": "vtr_data_bank_only",
            "text": "I don't have / partially have supporting documents — please prepare from my bank statements"
          }
        ]
      },
      {
        "id": "ffe23155-874f-492b-861d-9a8135f764e7",
        "text": "Would you like to include ongoing accounting or VAT filing as part of your package?",
        "help": "Now that you are registered for VAT, staying compliant requires quarterly VAT filing and up-to-date books. We can handle both so you never miss a deadline.",
        "options": [
          {
            "id": "c8ff3a50-2b03-4e77-ae74-5c2618878f8c",
            "value": "vtr_upsell_vat",
            "text": "VAT filing only — handle my quarterly VAT returns"
          },
          {
            "id": "d58f5664-6d01-4797-bb36-41f1b7a3d545",
            "value": "vtr_upsell_all",
            "text": "Bookkeeping + VAT & CT filing — complete package"
          },
          {
            "id": "c84a5b73-a074-4799-bef3-befb7053d81d",
            "value": "vtr_upsell_none",
            "text": "No — I will handle this separately"
          }
        ]
      }
    ]
  },
  "corporate-tax-filing": {
    "serviceId": "03d06317-9125-4100-ae21-5883873ee5b6",
    "slug": "corporate-tax-filing",
    "serviceName": "Corporate Tax Filing",
    "periodType": "start_only",
    "startDateInstruction": "Which month does your CT filing period start from?",
    "hidden": false,
    "chooserLabel": "Corporate Tax filing",
    "chooserHint": "File your Corporate Tax return with the FTA",
    "questions": [
      {
        "id": "183e9d04-65dd-4b86-b2bb-4c6a0e2a23a9",
        "text": "Are you registered for Corporate Tax with the FTA?",
        "help": "You'll need an active CT registration before we can file on your behalf. If you haven't registered yet, we'll take care of that first.",
        "options": [
          {
            "id": "aa12ade4-7d64-4482-b8d7-a867587c426b",
            "value": "ct_registered_yes",
            "text": "Yes — I'm registered"
          },
          {
            "id": "ff53607e-3605-4816-b7d5-855f96d0d65f",
            "value": "ct_registered_no",
            "text": "No — I need to register first"
          }
        ]
      },
      {
        "id": "0ca04893-16f2-4506-b926-2b747537d186",
        "text": "What is your company's total annual revenue?",
        "help": "If you're filing for one year, use that year's revenue. If you're filing for multiple years, use the combined total across all years being filed. For an upcoming year, use your expected annual revenue.",
        "options": [
          {
            "id": "8a1f158c-dd8c-4657-befe-2c4c802b30e2",
            "value": "ct_rev_none",
            "text": "Not yet trading — no revenue"
          },
          {
            "id": "8aa45229-0ecb-44c4-9f0a-c3084286da9c",
            "value": "ct_rev_under_100k",
            "text": "Under AED 100,000"
          },
          {
            "id": "5e2a7f0b-245e-4458-80ec-44ff0ef74983",
            "value": "ct_rev_100k_500k",
            "text": "AED 100,001 – 375,000"
          },
          {
            "id": "794bb441-cd60-47c4-964c-6238dfb52153",
            "value": "ct_rev_500k_1m",
            "text": "AED 375,001 – 1,000,000"
          },
          {
            "id": "a1b9611c-6424-4f7e-9e09-84a6600d1523",
            "value": "ct_rev_1m_3m",
            "text": "AED 1,000,001 – 3,000,000"
          },
          {
            "id": "869d46a5-fbee-43b2-9a21-0339001da09a",
            "value": "ct_rev_3m_5m",
            "text": "AED 3,000,001 – 5,000,000"
          },
          {
            "id": "c57025fb-a617-4963-afff-11b207968603",
            "value": "ct_rev_5m_10m",
            "text": "AED 5,000,001 – 10,000,000"
          },
          {
            "id": "f3fb6481-2995-418c-80c2-f6768bf7c00c",
            "value": "ct_rev_10m_20m",
            "text": "AED 10,000,001 – 20,000,000"
          },
          {
            "id": "cb1c684f-1239-4b4c-bf3b-76ad020f7523",
            "value": "ct_rev_20m_50m",
            "text": "AED 20,000,001 – 50,000,000"
          },
          {
            "id": "b182fcf9-47bd-4766-971e-3ab814007eff",
            "value": "ct_rev_50m_100m",
            "text": "AED 50,000,001 – 100,000,000"
          }
        ]
      },
      {
        "id": "6971b36f-5279-4dfe-8e9b-49b3c65bc05b",
        "text": "Which financial year or years do you need filed?",
        "help": "If you're up to date, just pick last year. If you've missed previous years, select how many years need to be covered — each year is filed and priced separately.",
        "options": [
          {
            "id": "092ed442-a725-4087-a4fe-b6462d5693bb",
            "value": "ct_year_last_1",
            "text": "Last year"
          },
          {
            "id": "4da088fc-c4a7-414f-8690-99d862e339ad",
            "value": "ct_year_last_2",
            "text": "Last 2 years"
          },
          {
            "id": "d1837c21-b5a2-40c5-8cac-987395ff9660",
            "value": "ct_year_upcoming",
            "text": "Upcoming year"
          }
        ]
      }
    ]
  },
  "corporate-tax-registration": {
    "serviceId": "40fdbfb3-d008-442d-aaf2-bef36f085e22",
    "slug": "corporate-tax-registration",
    "serviceName": "Corporate Tax Registration",
    "periodType": "none",
    "startDateInstruction": "",
    "hidden": false,
    "chooserLabel": "Corporate Tax registration",
    "chooserHint": "Get your Corporate Tax registration number",
    "questions": [
      {
        "id": "03b3160d-1cbc-4f7a-95e5-a86accf3fdb2",
        "text": "Which jurisdiction is your company registered in?",
        "help": "Select the authority under which your company is licensed. This helps us determine your Corporate Tax applicability, eligibility (e.g., Free Zone benefits), and filing requirements.",
        "options": [
          {
            "id": "6e1ab701-605c-44c6-aa53-2a80bdf2e584",
            "value": "register_my_business_for_corporate_tax",
            "text": "Free Zone"
          },
          {
            "id": "6cdc7404-0db7-4442-a4cc-047220ddd956",
            "value": "mainland",
            "text": "Mainland"
          }
        ]
      }
    ]
  },
  "audit-services": {
    "serviceId": "91e0af24-0c80-4590-b6cd-24f8dce0bf6c",
    "slug": "audit-services",
    "serviceName": "Audit Services",
    "periodType": "start_only",
    "startDateInstruction": "What is the start month of the financial year you need audited?",
    "hidden": false,
    "chooserLabel": "Audit",
    "chooserHint": "Audited financials for a licence, a bank or an investor",
    "questions": [
      {
        "id": "7af52b72-d3f4-484c-8a35-3cd8365539a2",
        "text": "What is the primary purpose of this audit?",
        "help": "This helps us understand the reporting standard and timeline required.",
        "options": [
          {
            "id": "c0a46c8f-39a0-4f29-980f-bf234082ef53",
            "value": "audit_purpose_license",
            "text": "License authority submission — required for trade licence renewal"
          },
          {
            "id": "89d1668e-95ac-40ad-aa0a-f3951efcfec4",
            "value": "audit_purpose_bank",
            "text": "Bank or credit facility — required by lender"
          },
          {
            "id": "b09a9692-9afa-4a73-96b9-4a5b7f8023af",
            "value": "audit_purpose_investor",
            "text": "Investor or management requirement"
          },
          {
            "id": "7b40db6c-d17d-4ee8-a7d6-b8c61ec5cc00",
            "value": "audit_purpose_ct",
            "text": "Corporate Tax filing"
          },
          {
            "id": "3621a5a8-10d7-43b6-a3b4-126a95b83e67",
            "value": "audit_purpose_visa",
            "text": "Visa or immigration requirement"
          },
          {
            "id": "3bb7438c-106d-4f3f-8e2c-3e8a9df075c2",
            "value": "audit_purpose_liquidation",
            "text": "Liquidation or Company Closure"
          },
          {
            "id": "c43b5829-acae-4c9d-ba92-d12f6bd33305",
            "value": "audit_purpose_other",
            "text": "Other"
          }
        ]
      },
      {
        "id": "94bb26b5-a7fe-4d69-b762-9d6aef6b60ec",
        "text": "Which audit service do you need?",
        "help": "An Auditor Appointment Letter is a formal letter confirming your appointed auditor — required by some authorities before audit work begins.",
        "options": [
          {
            "id": "bdddb07d-e220-4214-b321-77a60437c509",
            "value": "audit_report_only",
            "text": "Audit Report only"
          },
          {
            "id": "da219a8d-47ab-49cf-af1f-1aa06f832fc0",
            "value": "auditor_appointment_letter_only",
            "text": "Auditor Appointment Letter only"
          },
          {
            "id": "32398be0-97f5-448d-b0c5-1086009c19f3",
            "value": "both__audit_report_and_auditor_appointment_letter",
            "text": "Both — Audit Report and Auditor Appointment Letter"
          }
        ]
      },
      {
        "id": "ea2970ae-3d52-4d0c-8462-6cc1703fbea0",
        "text": "How many years of audit do you need?",
        "help": "Each financial year is audited separately. If this is your first audit, select accordingly.",
        "options": [
          {
            "id": "12bb80f8-eee9-4e6c-ba51-70f8024ab5de",
            "value": "audit_years_first",
            "text": "This is my first audit — first year only"
          },
          {
            "id": "8ce3aa24-64e4-48ef-bf53-c0dc77ec230a",
            "value": "audit_years_1",
            "text": "1 year — last financial year"
          },
          {
            "id": "f4654567-d2a3-4bba-99c8-37e6ff75e904",
            "value": "audit_years_2",
            "text": "2 years"
          },
          {
            "id": "de4eb303-c536-40e2-81f3-968123e5b998",
            "value": "audit_years_3",
            "text": "3 years"
          },
          {
            "id": "a87528e5-5302-4cbf-ad13-818f9ae039f4",
            "value": "audit_years_4",
            "text": "4 years"
          },
          {
            "id": "90111c48-489e-47a7-99cc-954f07975b51",
            "value": "audit_years_5",
            "text": "5 years"
          }
        ]
      },
      {
        "id": "4e4f2ecd-3e44-428a-bc0a-194e9c2092b6",
        "text": "Was your previous financial year audited?",
        "help": "If the prior year was not audited, your opening balances will be unverified. This may result in a qualified audit opinion, which some authorities and lenders may not accept. We strongly recommend auditing prior years to ensure a clean unqualified report.",
        "options": [
          {
            "id": "e249048a-c6cc-4299-bac1-e06e779fbd2a",
            "value": "audit_prior_yes",
            "text": "Yes — previous year was audited"
          },
          {
            "id": "fc186b5a-c73a-469e-8c9e-770c42c53f9c",
            "value": "audit_prior_no_include",
            "text": "No — I want to include the unaudited prior years too"
          },
          {
            "id": "0d6c3a98-b006-418c-a2b6-c99db34d9e9d",
            "value": "audit_prior_no_qualified",
            "text": "No — I am okay with a qualified audit opinion"
          }
        ]
      },
      {
        "id": "ea0f39ac-8f08-4774-9eec-8a1740ae9c41",
        "text": "What is your approximate annual revenue for the audit period?",
        "help": "Audit fees are based on annual turnover. This helps us calculate the correct price for your engagement.",
        "options": [
          {
            "id": "ddc01725-f8fb-4ac0-a9f2-08ad28e70fc2",
            "value": "audit_rev_zero",
            "text": "Zero — no revenue"
          },
          {
            "id": "9e063560-3e2b-4272-a189-7dd4b2399e9a",
            "value": "audit_rev_100k",
            "text": "Under AED 100,000"
          },
          {
            "id": "1c005a02-954b-434b-b62a-b7792d8f1dc5",
            "value": "audit_rev_500k",
            "text": "AED 100,001 – 500,000"
          },
          {
            "id": "5e0472b9-80a8-4828-83ca-89268d9cb637",
            "value": "audit_rev_1m",
            "text": "AED 500,001 – 1,000,000"
          },
          {
            "id": "5e2eca41-e1e8-4c43-92b5-b656faf6727f",
            "value": "audit_rev_2m",
            "text": "AED 1,000,001 – 2,000,000"
          },
          {
            "id": "928b5ae8-4c1e-4d49-9b25-b045acb7e124",
            "value": "audit_rev_3m",
            "text": "AED 2,000,001 – 3,000,000"
          },
          {
            "id": "732c7d30-ddfd-4285-9e79-b3007e50a63e",
            "value": "audit_rev_5m",
            "text": "AED 3,000,001 – 5,000,000"
          },
          {
            "id": "4b677a61-3f29-4109-9416-fc1c639833aa",
            "value": "audit_rev_10m",
            "text": "AED 5,000,001 – 10,000,000"
          },
          {
            "id": "661991fd-9b67-4cf5-9703-e4f45e288c3f",
            "value": "audit_rev_20m",
            "text": "AED 10,000,001 – 20,000,000"
          },
          {
            "id": "0472afdf-33bf-462d-8961-fed246834775",
            "value": "audit_rev_50m",
            "text": "AED 20,000,001 – 50,000,000"
          }
        ]
      },
      {
        "id": "9d9d6d2b-736d-49ff-8d95-415592fef5c4",
        "text": "Would you like Corporate Tax filing included?",
        "help": "If your audit is for CT purposes, or your CT filing is due, we can handle both together — your audited financials feed directly into your CT return.",
        "options": [
          {
            "id": "4295d6af-3ae2-4e71-9f08-ca00a93342f9",
            "value": "audit_ct_yes",
            "text": "Yes — include CT filing"
          },
          {
            "id": "52ceb528-89f5-4de3-a3d2-d425125eb719",
            "value": "audit_ct_no",
            "text": "No — not required"
          }
        ]
      },
      {
        "id": "27586f1b-02b5-4bd3-b41e-eca50ed15652",
        "text": "Do you have up-to-date financial statements ready for the audit period?",
        "help": "To begin the audit, we need your trial balance, general ledger, and supporting schedules — including fixed asset registers, prepayment schedules, loan schedules, and bank reconciliations. If these are not ready or need review, we can help prepare or clean them up first.",
        "options": [
          {
            "id": "a406545a-faef-4c5d-adc5-c5421087751d",
            "value": "audit_fs_ready",
            "text": "Yes — financials, ledgers and schedules are all ready"
          },
          {
            "id": "e92fd3da-c8c6-4296-8996-2d93c78ee27a",
            "value": "audit_fs_needs_review",
            "text": "Yes — but they need corrections and review first"
          },
          {
            "id": "4af832a2-ca17-4056-a687-ac1939a779c3",
            "value": "audit_fs_not_ready",
            "text": "No — books are not maintained or up to date"
          }
        ]
      }
    ]
  },
  "aml-compliance": {
    "serviceId": "6c84fabd-28ff-45b6-b04f-7628a0c20a7d",
    "slug": "aml-compliance",
    "serviceName": "AML Compliance",
    "periodType": "start_only",
    "startDateInstruction": "When should we start your ongoing AML compliance service?",
    "hidden": false,
    "chooserLabel": "AML compliance",
    "chooserHint": "goAML, policies, screening and staff training",
    "questions": [
      {
        "id": "1381dcc9-15f2-4f9a-b1ad-13a6b336dce6",
        "text": "What best describes your business activity?",
        "help": "Select the option that best describes your business activity so we can apply the correct AML compliance requirements.",
        "options": [
          {
            "id": "d3628579-cd33-4a08-950b-0e366146fb98",
            "value": "real-estate-brokerage",
            "text": "Real Estate Brokerage / Agents"
          },
          {
            "id": "c4f25f7e-a703-464e-a94a-435f997acac9",
            "value": "accounting-audit-firm",
            "text": "Accounting / Audit Firm"
          },
          {
            "id": "67947834-e1fa-4c13-835c-4d291d592657",
            "value": "company-formation-business-setup",
            "text": "Company Formation / Business Setup"
          },
          {
            "id": "f46751f9-2ead-4444-b604-56a840afed9d",
            "value": "precious-metals-stones-trading",
            "text": "Precious Metals / Stones Trading (Gold, Diamonds)"
          },
          {
            "id": "54306d4a-e80e-4dc2-9b1a-551a120a1b7a",
            "value": "virtual-assets-crypto",
            "text": "Virtual Assets / Crypto Business"
          },
          {
            "id": "5d87108c-13c7-406f-92c3-877edc7cd944",
            "value": "legal-consultancy-services",
            "text": "Legal / Consultancy Services"
          },
          {
            "id": "6c459765-b270-42e9-b029-60968b42ab6d",
            "value": "trust-corporate-services-provider",
            "text": "Trust / Corporate Services Provider"
          },
          {
            "id": "4cfde1ed-f13b-41ac-ae24-55e0d9d1b666",
            "value": "other-regulated-business",
            "text": "Other Regulated Business"
          }
        ]
      },
      {
        "id": "d96a96df-8230-435c-8dec-a78bc0e35192",
        "text": "Is your business already registered on the goAML and MOE portal?",
        "help": "AML registration is a mandatory first step before compliance services can begin.",
        "options": [
          {
            "id": "8ac96c2a-a435-406b-80be-1abce6270a56",
            "value": "amlc_registered_yes",
            "text": "Yes — already registered"
          },
          {
            "id": "f54371af-8e1f-4978-91e0-d5d5f11dfdc1",
            "value": "amlc_registered_no",
            "text": "No — not yet registered"
          }
        ]
      },
      {
        "id": "5f37e7d2-9207-4d51-b38a-50e4256e7934",
        "text": "What is the main reason you are looking for AML compliance support?",
        "help": "Pick the one that best describes your situation right now.",
        "options": [
          {
            "id": "e6ca900c-e08d-4fcb-bc55-6f115fb2264a",
            "value": "amlc_reason_regulatory",
            "text": "Regulatory requirement — I need to be compliant to operate"
          },
          {
            "id": "6bcbeed1-e110-4018-831e-ab48626cb2f5",
            "value": "amlc_reason_inspection",
            "text": "Upcoming regulatory inspection or audit"
          },
          {
            "id": "f2794880-32c6-4db9-95d3-6c2636dcf90a",
            "value": "amlc_reason_new",
            "text": "Setting up from scratch — new to AML obligations"
          },
          {
            "id": "217be040-3245-468e-9030-e8a3b442323a",
            "value": "amlc_reason_review",
            "text": "Existing policy needs a review and update"
          },
          {
            "id": "6d76cce5-1e28-4a2a-8755-ae83e795699d",
            "value": "amlc_reason_findings",
            "text": "Had findings from a past inspection — need to fix gaps"
          }
        ]
      },
      {
        "id": "79d2cf59-8636-4cbc-beeb-1f5a9790bc73",
        "text": "How many customers does your business screen or onboard per year?",
        "help": "Include all customers you conduct due diligence on annually.",
        "options": [
          {
            "id": "eaecf242-cf9b-43e6-9f12-49bece56599d",
            "value": "amlc_cust_10",
            "text": "1 – 10"
          },
          {
            "id": "a907af6e-ea32-44d0-b783-829b67a5f8b3",
            "value": "amlc_cust_25",
            "text": "11 – 25"
          },
          {
            "id": "61ea2d6d-e0db-467d-83cd-f06b1e98aa6e",
            "value": "amlc_cust_50",
            "text": "26 – 50"
          },
          {
            "id": "8ad180ab-b673-4012-95e4-2f6cf86fdfb9",
            "value": "amlc_cust_100",
            "text": "51 – 100"
          },
          {
            "id": "09775102-8e7d-4743-99a2-940a342bdf10",
            "value": "amlc_cust_200",
            "text": "101 – 200"
          },
          {
            "id": "94a09d75-10e3-47d1-a6b4-d57b88365506",
            "value": "amlc_cust_500",
            "text": "201 – 500"
          },
          {
            "id": "121c37fa-8537-4a63-be31-f07b1aef9782",
            "value": "amlc_cust_750",
            "text": "501 – 750"
          },
          {
            "id": "38c84e34-dd31-4eb9-ad01-d4dfb6a2318f",
            "value": "amlc_cust_1000",
            "text": "751 – 1,000"
          },
          {
            "id": "adf05667-0167-4065-8ca5-9115c3f399db",
            "value": "amlc_cust_2000",
            "text": "1,001 – 2,000"
          },
          {
            "id": "2c34fd69-29d8-4349-b957-3010b552064d",
            "value": "amlc_cust_2000plus",
            "text": "More than 2,000"
          }
        ]
      },
      {
        "id": "43e966ef-41a8-4660-9117-563bc473ebd8",
        "text": "How many employees require AML training and certification?",
        "help": "All staff involved in customer onboarding, transactions, and compliance must be trained under UAE AML regulations.",
        "options": [
          {
            "id": "a906513c-fda6-4b9f-a8de-4817a7cb3d0b",
            "value": "amlc_emp_5",
            "text": "1 – 5"
          },
          {
            "id": "2abc288e-be61-4ab0-8ff0-adcf976f5947",
            "value": "amlc_emp_10",
            "text": "6 – 10"
          },
          {
            "id": "1345b0c6-3f40-4860-a19e-07aab958b69a",
            "value": "amlc_emp_15",
            "text": "11 – 15"
          },
          {
            "id": "0b33cc6d-7b51-47c8-8024-cbec306bae7b",
            "value": "amlc_emp_25",
            "text": "16 – 25"
          },
          {
            "id": "534dade0-5888-4951-bc41-33f350905bda",
            "value": "amlc_emp_25plus",
            "text": "More than 25"
          }
        ]
      },
      {
        "id": "00725ece-1c81-4c3b-b3c7-07d20a35d212",
        "text": "Are you currently using any AML tools or software?",
        "help": "Select your current setup so we can align or implement the right AML systems for your business.",
        "options": [
          {
            "id": "2ea0d82d-ab69-4f7c-9d6e-6e4efa5deb81",
            "value": "yes_—_using_aml_tools",
            "text": "Yes — using AML tools"
          },
          {
            "id": "733f243e-b155-49d6-aff6-35947d8d7c59",
            "value": "no_—_not_using_any_tools",
            "text": "No — not using any tools"
          }
        ]
      },
      {
        "id": "a823352d-31e1-48d7-a033-ed2be4cde7dc",
        "text": "Do you have any backlog of customer screenings or transaction monitoring that has not been completed?",
        "help": "If screenings or monitoring have been missed, we can catch up on outstanding work before setting up your ongoing compliance.",
        "options": [
          {
            "id": "f85d25e5-af21-480b-828d-eed9f53df415",
            "value": "amlc_backlog_no",
            "text": "No — we are up to date"
          },
          {
            "id": "cf94fefd-ade8-4e8f-9036-02dc9ded1075",
            "value": "amlc_backlog_yes",
            "text": "Yes — I have pending screenings to clear"
          }
        ]
      }
    ]
  },
  "dedicated-remote-accountant": {
    "serviceId": "83990d6f-6d27-41db-9f7f-19771778a0a1",
    "slug": "dedicated-remote-accountant",
    "serviceName": "Dedicated Remote Accountant",
    "periodType": "start_only",
    "startDateInstruction": "When would you like your dedicated accountant to start?",
    "hidden": false,
    "chooserLabel": "A dedicated remote accountant",
    "chooserHint": "Your own accountant, part-time or full-time",
    "questions": [
      {
        "id": "467ea108-91b1-46c0-a756-8ff4c066a817",
        "text": "What best describes your organisation?",
        "help": "This helps us match you to the right accountant profile and engagement model.",
        "options": [
          {
            "id": "3d38e336-62c0-4c66-b1cf-6eed6a6cc770",
            "value": "dra_client_biz",
            "text": "My own business — in-house accounting support"
          },
          {
            "id": "068666ea-e6bd-4d55-af3c-7351263e98eb",
            "value": "dra_client_group",
            "text": "Group or holding company — multiple entities"
          },
          {
            "id": "44c855c6-85e2-4cc4-b5d7-6202a857f5de",
            "value": "dra_client_cfo",
            "text": "CFO / Finance Manager — need execution support"
          },
          {
            "id": "8f547c4e-792b-4b82-854a-a4d253aed097",
            "value": "dra_client_ca",
            "text": "CA / CPA / Accounting firm — white-label delivery"
          },
          {
            "id": "73ce5df2-0048-445b-ac4b-0786f77b681b",
            "value": "dra_client_consulting",
            "text": "Consulting or professional services firm"
          },
          {
            "id": "b4156ce4-0335-42ba-ac23-556a52b70f8a",
            "value": "dra_client_other",
            "text": "Other"
          }
        ]
      },
      {
        "id": "4075c1c3-61a2-445c-8586-8551230a3f94",
        "text": "What engagement model do you need?",
        "help": "Fixed shift is a set daily time window. Flexible hours are drawn from a monthly bank based on tasks.",
        "options": [
          {
            "id": "ff6a5943-38c7-42f1-b3b8-e1b36146e6dc",
            "value": "dra_fixed_pte",
            "text": "Fixed shift — 4 hrs/day, same daily time window"
          },
          {
            "id": "99081e21-c51c-4977-9547-c03df6df7cec",
            "value": "dra_fixed_fte",
            "text": "Fixed shift — 8 hrs/day, full working day"
          },
          {
            "id": "07918ba5-f907-4d26-be86-7afdd0d3810c",
            "value": "dra_flex_pte",
            "text": "Flexible hours — up to 60 hrs/month, task-based"
          },
          {
            "id": "46d9e0f8-9277-4e44-9a1a-db4dc4598965",
            "value": "dra_flex_fte",
            "text": "Flexible hours — up to 120 hrs/month, task-based"
          }
        ]
      },
      {
        "id": "edf30f09-408b-4ba4-ab27-1d9f9634e615",
        "text": "What level of accountant do you need?",
        "help": "Junior accountants are suited for growing businesses with standard bookkeeping, payroll, and reconciliation needs. Senior accountants take on complex work including multi-entity structures, foreign currency transactions, group consolidation, and management reporting.",
        "options": [
          {
            "id": "47d709ed-5a81-48de-8665-c15c2acc282f",
            "value": "dra_junior",
            "text": "Junior — standard bookkeeping, payroll & reconciliation"
          },
          {
            "id": "c285db4b-7d9e-4880-9e92-a06310c12355",
            "value": "dra_senior",
            "text": "Senior — multi-entity, foreign currency & complex accounting"
          }
        ]
      },
      {
        "id": "beb5bb04-0e02-4622-a26a-3fa3f22648cc",
        "text": "How many dedicated accountants do you need?",
        "help": "Each accountant is assigned exclusively to your account.",
        "options": [
          {
            "id": "477ddbe7-f284-40a8-8861-ed99068cdd36",
            "value": "dra_res_1",
            "text": "1"
          },
          {
            "id": "8f9fdbbc-2909-4ce1-a6f5-283ed864df62",
            "value": "dra_res_2",
            "text": "2"
          },
          {
            "id": "1f34d706-a1d3-4ad5-85e3-658254c425f1",
            "value": "dra_res_3",
            "text": "3"
          },
          {
            "id": "ef965946-eeef-4348-9bfc-b9ecdc71bd63",
            "value": "dra_res_4",
            "text": "4"
          },
          {
            "id": "b0efa417-0e35-431b-af20-85dfb69fd763",
            "value": "dra_res_5",
            "text": "5"
          },
          {
            "id": "ca21109e-e0df-42fd-8bc1-98c76705aa0f",
            "value": "dra_res_6_10",
            "text": "6 – 10"
          },
          {
            "id": "d493a3f5-5c7a-4796-8816-bc312e58e185",
            "value": "dra_res_11_20",
            "text": "11 – 20"
          },
          {
            "id": "49c860b3-26cf-4f7a-9f51-d6c1591f8590",
            "value": "dra_res_20plus",
            "text": "More than 20"
          }
        ]
      },
      {
        "id": "67ef2cff-ba50-4a4e-a8c9-44acae1df624",
        "text": "Where is your business primarily based?",
        "help": "This helps us apply the right pricing structure and service setup based on your operating region.",
        "options": [
          {
            "id": "c7e7e21b-3825-4009-9d9b-3a33d003782c",
            "value": "dra_region_uae",
            "text": "UAE"
          },
          {
            "id": "0aee160f-f3ae-4051-89bf-bcff575e49e9",
            "value": "dra_region_gcc",
            "text": "Saudi Arabia, Kuwait, Qatar, Oman, Bahrain"
          },
          {
            "id": "90c2cd56-9a00-4a2f-952a-ecc674b24124",
            "value": "dra_region_intl",
            "text": "International (UK, USA, or other countries)"
          }
        ]
      },
      {
        "id": "f89c817b-5c85-468b-97a1-2fc5dcb97096",
        "text": "Do you have any backlog or catch-up accounting that needs sorting first?",
        "help": "Prior-period backlog is always out of scope and quoted separately before any work begins.",
        "options": [
          {
            "id": "64495328-8aa3-464c-ad32-2ac4912fa1d5",
            "value": "dra_catchup_no",
            "text": "No — books are up to date"
          },
          {
            "id": "bdc45757-1143-4b7e-8f54-fdd832fa512e",
            "value": "dra_catchup_minimal",
            "text": "Minimal — just a few entries (less than 20 transactions)"
          },
          {
            "id": "aaa27e94-6f92-4fd4-90b4-f782103fb4d3",
            "value": "dra_catchup_some",
            "text": "Some — a few weeks or months behind"
          },
          {
            "id": "2a42d200-a54a-4dd4-8713-0cec0c632d6e",
            "value": "dra_catchup_heavy",
            "text": "Significant — messy or unmaintained for a while"
          }
        ]
      },
      {
        "id": "46aa3db9-55a4-486e-b3c7-3682bf926cc5",
        "text": "Do you need VAT and Corporate Tax services included?",
        "help": "Your dedicated accountant will maintain your books and prepare all required workings, while tax filing, review, and submission are handled by our qualified tax specialists as a separate service.",
        "options": [
          {
            "id": "90584ef0-ffce-4e11-8818-f71fea33f0ae",
            "value": "dra_filing_both",
            "text": "Yes"
          },
          {
            "id": "2154cb94-f697-49a9-b249-4ec1097677d0",
            "value": "dra_filing_none",
            "text": "No — not required"
          }
        ]
      }
    ]
  }
};

export const QUOTE_PLANS = {
  "accounting": {
    "chooserTitle": "",
    "chooserSubtitle": "",
    "services": [
      "accounting-bookkeeping"
    ]
  },
  "payroll": {
    "chooserTitle": "",
    "chooserSubtitle": "",
    "services": [
      "finance-operations"
    ]
  },
  "booksCleanup": {
    "chooserTitle": "",
    "chooserSubtitle": "",
    "services": [
      "prior-period-catch-up"
    ]
  },
  "general": {
    "chooserTitle": "What do you need help with?",
    "chooserSubtitle": "Pick one to price. We can add the rest on the call.",
    "services": [
      "accounting-bookkeeping",
      "vat-filing",
      "vat-registration",
      "corporate-tax-filing",
      "corporate-tax-registration",
      "audit-services",
      "aml-compliance",
      "dedicated-remote-accountant"
    ]
  }
};

/**
 * Resolves a page's plan into the services it can quote.
 *
 * A plan with one service goes straight to its questions. A plan with several
 * asks the visitor to choose first, and that choice is single-select — pricing
 * more than one service at a time needs FinCore's combo endpoints, which this
 * client does not implement.
 *
 * @param {string} key
 * @returns {{ key: string, chooserTitle: string, chooserSubtitle: string,
 *   services: object[], needsChoice: boolean } | undefined}
 */
export const getQuotePlan = (key) => {
  const plan = QUOTE_PLANS[key];
  if (!plan) return undefined;
  const services = plan.services.map((serviceKey) => QUOTE_SERVICES[serviceKey]);
  return {
    key,
    chooserTitle: plan.chooserTitle,
    chooserSubtitle: plan.chooserSubtitle,
    services,
    needsChoice: services.length > 1,
  };
};
