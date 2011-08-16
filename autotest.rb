# execute this file using watchr

def run_all_tests
  print `clear`
  puts "Tests run #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
  `nodeunit ./specs`
end

warning_icon = '/usr/share/icons/Humanity/status/48/dialog-warning.svg'
happy_icon = '/usr/share/icons/Humanity/emblems/48/emblem-OK.svg'

ignore = ['public','node_modules','views']
dirs = Dir.glob('*/').map { |d| d.sub '/','' }.select { |d| !ignore.any? { |i| i == d }}.join('|')
pattern = '(' + dirs + ')(/.*)+.js'

run_all_tests

watch(pattern) do |m| 
  ouput = run_all_tests.to_s
  if ouput.include? 'FAILURES'
    `notify-send -u critical "Red" "Failing Test(s)" -i #{warning_icon} -t 1500`
  else 
    `notify-send -u critical "Green" "All tests are passing." -i #{happy_icon} -t 500`
  end
  puts ouput
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