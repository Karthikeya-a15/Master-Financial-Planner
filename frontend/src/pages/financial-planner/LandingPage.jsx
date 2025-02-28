<div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Hero />} />
          </Routes>
          <Features />
          <Quotes />
          <CallToAction />
        </main>
        <Footer />
      </div>