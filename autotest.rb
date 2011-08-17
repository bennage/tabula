# execute this file using watchr

def run_all_tests
  print `clear`
  puts "Tests run #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
  `expresso -b ./specs/*.js 2>&1`
end

warning_icon = '/usr/share/icons/Humanity/status/48/dialog-warning.svg'
happy_icon = '/usr/share/icons/Humanity/emblems/48/emblem-OK.svg'

ignore = ['public','node_modules','views']
dirs = Dir.glob('*/').map { |d| d.sub '/','' }.select { |d| !ignore.any? { |i| i == d }}.join('|')
pattern = '(' + dirs + ')(/.*)+.js'
failurePattern = /Failures:\s+(\d+)/

run_all_tests

watch(pattern) do |m| 
  output = run_all_tests.to_s
  
  if output =~ /Failures:\s+(\d+)/
    `notify-send -u critical "Red" "#{$1} failing test(s)." -i #{warning_icon}`
  else
    `notify-send -u critical "Green" "All tests are passing." -i #{happy_icon}`
  end

  puts output
end

@interrupted = false

# Ctrl-C
Signal.trap 'INT' do
  if @interrupted
    abort('\n')
  else
    puts 'Interrupt a second time to quit'
    @interrupted = true
    Kernel.sleep 1.5

    run_all_tests
    @interrupted = false
  end
end