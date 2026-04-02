'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <h2 className="typography-heading-3 text-foreground">Blog System</h2>
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:order-1">
            <p className="text-center typography-body-small text-secondary">
              &copy; 2026 Blog System. All rights reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center space-x-6 md:mt-0">
            <a href="#" className="text-secondary hover:text-foreground typography-body-small">
              <span className="sr-only">About us</span>
              About
            </a>
            <a href="#" className="text-secondary hover:text-foreground typography-body-small">
              <span className="sr-right">Contact us</span>
              Contact
            </a>
            <a href="#" className="text-secondary hover:text-foreground typography-body-small">
              <span className="sr-only">Privacy policy</span>
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;